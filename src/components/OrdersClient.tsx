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
      className={`bg-pure-white p-5 rounded-lg border border-graphite-border shadow-sm group transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md ${isDragging ? 'z-50 ring-2 ring-apple-blue' : ''}`}
    >
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-near-black">Table {order.tableId.substring(0, 4)}...</span>
        <span className="font-bold text-apple-blue">${order.totalPrice.toFixed(2)}</span>
      </div>
      <p className="text-[12px] text-gray-400 mb-4 font-mono">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      
      {nextStatus && (
        <button
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={(e) => {
            e.stopPropagation();
            updateStatus(order.id, nextStatus);
          }}
          className={`w-full text-[14px] font-semibold py-2.5 rounded-md transition-all active:scale-95 ${
            order.status === 'pending' ? 'bg-apple-blue text-pure-white' :
            order.status === 'preparing' ? 'bg-graphite-a text-pure-white border border-graphite-b' :
            'bg-pale-gray text-near-black border border-graphite-border'
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
      className={`bg-pale-gray p-6 rounded-lg border transition-all duration-200 ${
        isOver ? 'bg-apple-blue/5 border-apple-blue ring-4 ring-apple-blue/10' : 'border-graphite-border'
      }`}
    >
      <h2 className={`font-semibold text-[14px] uppercase tracking-wider text-near-black/50 mb-6 flex items-center gap-2`}>
        <Icon className={`w-4 h-4 ${colorClass}`} /> {title}
      </h2>
      <div className="space-y-4 min-h-[150px]">
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
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-[40px] font-semibold text-near-black tracking-tight leading-none mb-4">Live Orders</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-apple-blue animate-pulse" />
              <span className="text-[12px] font-semibold uppercase tracking-widest text-near-black/40">Synchronized Engine</span>
            </div>
          </div>
          <button 
            onClick={fetchOrders} 
            className="flex items-center gap-2 px-4 py-2.5 bg-pure-white border border-graphite-border rounded-md text-[14px] font-semibold text-near-black hover:bg-pale-gray transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <StatusColumn id="pending" title="Pending" icon={Clock} colorClass="text-apple-blue">
            {pendingOrders.map(order => (
              <DraggableOrderCard key={order.id} order={order} updateStatus={updateStatus} />
            ))}
          </StatusColumn>

          <StatusColumn id="preparing" title="Preparing" icon={RefreshCw} colorClass="text-apple-blue">
            {preparingOrders.map(order => (
              <DraggableOrderCard key={order.id} order={order} updateStatus={updateStatus} />
            ))}
          </StatusColumn>

          <StatusColumn id="served" title="Served" icon={CheckCircle2} colorClass="text-apple-blue">
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
          <div className="bg-pure-white p-5 rounded-lg shadow-2xl border border-apple-blue/30 scale-105 cursor-grabbing opacity-90">
             <div className="flex justify-between mb-2">
              <span className="font-semibold text-near-black">Table {activeOrder.tableId.substring(0, 4)}...</span>
              <span className="font-bold text-apple-blue">${activeOrder.totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-[12px] text-gray-400 font-mono">{new Date(activeOrder.createdAt).toLocaleTimeString()}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
