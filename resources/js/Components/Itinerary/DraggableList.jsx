import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ItineraryCard from './ItineraryCard';
import TransportConnector from './TransportConnector';

/**
 * DraggableList Component - Wrapper for drag and drop reordering
 *
 * Inspired by Futurenda: smooth drag, visual feedback, drop zones
 * Uses @hello-pangea/dnd for React 18 compatibility
 *
 * @param {Array} items - Array of itinerary items
 * @param {Function} onReorder - Callback when items are reordered
 * @param {Function} onRemove - Callback when item is removed
 * @param {boolean} showTransport - Whether to show transport connectors
 */
export default function DraggableList({
    items = [],
    onReorder,
    onRemove,
    showTransport = true,
    className = '',
}) {
    const handleDragEnd = (result) => {
        // Dropped outside the list
        if (!result.destination) return;

        // No change in position
        if (result.source.index === result.destination.index) return;

        // Create new array with reordered items
        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        // Call callback with new order
        onReorder && onReorder(reorderedItems);
    };

    if (items.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-16 px-4 glass-card rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-700 ${className}`}>
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-float">
                    <span className="text-5xl filter drop-shadow-sm">🗺️</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Belum ada destinasi</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                    Pilih destinasi dari peta atau daftar untuk memulai merencanakan perjalananmu
                </p>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="itinerary-list">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-1 ${snapshot.isDraggingOver ? 'bg-teal-50/30 dark:bg-teal-900/10 rounded-2xl p-2 transition-all duration-300 ring-2 ring-teal-200/50' : ''
                            } ${className}`}
                    >
                        {items.map((item, index) => (
                            <div key={item.id} className="relative z-10">
                                <Draggable
                                    draggableId={String(item.id)}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`transition-all duration-200 ${snapshot.isDragging ? 'z-50 scale-105' : 'z-0'
                                                }`}
                                        >
                                            <ItineraryCard
                                                item={item}
                                                index={index}
                                                isDragging={snapshot.isDragging}
                                                dragHandleProps={provided.dragHandleProps}
                                                onRemove={onRemove}
                                            />
                                        </div>
                                    )}
                                </Draggable>

                                {/* Transport Connector between items */}
                                {showTransport && index < items.length - 1 && (
                                    <TransportConnector
                                        distance={items[index + 1]?.dist_from_prev_km || 0}
                                        cost={items[index + 1]?.est_transport_cost || 0}
                                        mode={items[index + 1]?.transportation_mode || 'CAR'}
                                    />
                                )}
                            </div>
                        ))}
                        {provided.placeholder}

                        {/* Drop zone indicator */}
                        {snapshot.isDraggingOver && (
                            <div className="h-24 border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-2xl bg-teal-50/50 dark:bg-teal-900/20 flex items-center justify-center animate-pulse">
                                <span className="text-sm text-teal-600 dark:text-teal-400 font-bold bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                    Lepas di sini untuk memindahkan
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
