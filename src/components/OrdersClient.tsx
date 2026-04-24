"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Clock, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Order {
  id: string;
  tableId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Memoized Card Component
const DraggableOrderCard = React.memo(({ order, updateStatus }: { order: Order; updateStatus: (id: string, s: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
    data: order,
  });

  const style = {
    // Optimization: Remove transform if the card is the one being dragged (handled by DragOverlay)
    transform: isDragging ? undefined : CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  const getNextStatus = (current: string) => {
    if (current === 'pending') return 'preparing';
    if (current === 'preparing') return 'served';
    if (current === 'served') return 'completed';
    return null;
  };

  const nextStatus = getNextStatus(order.status);
  const buttonLabels: Record<string, string> = {
    pending: 'Start Preparing',
    preparing: 'Mark as Served',
    served: 'Complete',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 group transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md ${isDragging ? 'z-50 ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex justify-between mb-2">
        <span className="font-bold text-gray-900">Table {order.tableId.substring(0, 4)}...</span>
        <span className="font-semibold text-blue-600">${order.totalPrice.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">{new Date(order.createdAt).toLocaleTimeString()}</p>
      
      {nextStatus && (
        <button
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={(e) => {
            e.stopPropagation();
            updateStatus(order.id, nextStatus);
          }}
          className={`w-full font-medium py-2 rounded-lg transition-colors ${
            order.status === 'pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
            order.status === 'preparing' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
            'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {buttonLabels[order.status]}
        </button>
      )}
    </div>
  );
});

DraggableOrderCard.displayName = 'DraggableOrderCard';

// Memoized Column Component
const StatusColumn = React.memo(({ 
  id, 
  title, 
  icon: Icon, 
  colorClass, 
  children 
}: { 
  id: string; 
  title: string; 
  icon: any; 
  colorClass: string; 
  children: React.ReactNode 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 p-4 rounded-2xl border transition-colors duration-200 ${
        isOver ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'border-gray-200'
      }`}
    >
      <h2 className={`font-bold text-gray-700 mb-4 flex items-center gap-2`}>
        <Icon className={`w-5 h-5 ${colorClass}`} /> {title}
      </h2>
      <div className="space-y-4 min-h-[100px]">
        {children}
      </div>
    </div>
  );
});

StatusColumn.displayName = 'StatusColumn';

export default function OrdersClient({ tenantId }: { tenantId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Optimization: Stable sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?tenantId=${tenantId}`);
      const data = await res.json() as Order[];
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchOrders();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws?tenantId=${tenantId}`;
    let ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new-order' || data.type === 'order-update') {
        fetchOrders();
      }
    };

    ws.onclose = () => {
      setTimeout(() => {
        fetchOrders();
      }, 3000);
    };

    return () => ws.close();
  }, [tenantId, fetchOrders]);

  const updateStatus = useCallback(async (orderId: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, status })
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  }, [tenantId, fetchOrders]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveOrder(event.active.data.current as Order);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOrder(null);

    if (over && active.id !== over.id) {
      const newStatus = over.id as string;
      const order = active.data.current as Order;

      if (order.status !== newStatus) {
        updateStatus(order.id, newStatus);
      }
    }
  }, [updateStatus]);

  // Optimization: Memoized lists
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending'), [orders]);
  const preparingOrders = useMemo(() => orders.filter(o => o.status === 'preparing'), [orders]);
  const servedOrders = useMemo(() => orders.filter(o => o.status === 'served'), [orders]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Live Orders</h1>
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Live Sync</span>
            </div>
          </div>
          <button onClick={fetchOrders} className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatusColumn id="pending" title="Pending" icon={Clock} colorClass="text-orange-500">
            {pendingOrders.map(order => (
              <DraggableOrderCard key={order.id} order={order} updateStatus={updateStatus} />
            ))}
          </StatusColumn>

          <StatusColumn id="preparing" title="Preparing" icon={RefreshCw} colorClass="text-blue-500">
            {preparingOrders.map(order => (
              <DraggableOrderCard key={order.id} order={order} updateStatus={updateStatus} />
            ))}
          </StatusColumn>

          <StatusColumn id="served" title="Served" icon={CheckCircle2} colorClass="text-green-500">
            {servedOrders.map(order => (
              <DraggableOrderCard key={order.id} order={order} updateStatus={updateStatus} />
            ))}
          </StatusColumn>
        </div>
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeOrder ? (
          <div className="bg-white p-4 rounded-xl shadow-xl border border-blue-200 scale-105 cursor-grabbing opacity-90">
             <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-900">Table {activeOrder.tableId.substring(0, 4)}...</span>
              <span className="font-semibold text-blue-600">${activeOrder.totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400">{new Date(activeOrder.createdAt).toLocaleTimeString()}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
