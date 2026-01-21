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
            <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">🗺️</span>
                </div>
                <h3 className="font-semibold text-headline mb-1">Belum ada destinasi</h3>
                <p className="text-sm text-paragraph text-center max-w-xs">
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
                        className={`space-y-0 ${
                            snapshot.isDraggingOver ? 'bg-secondary/50 rounded-xl' : ''
                        } ${className}`}
                    >
                        {items.map((item, index) => (
                            <div key={item.id}>
                                <Draggable
                                    draggableId={String(item.id)}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`transition-transform ${
                                                snapshot.isDragging ? 'z-50' : 'z-0'
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
                            <div className="h-20 border-2 border-dashed border-button/30 rounded-xl bg-button/5 flex items-center justify-center">
                                <span className="text-sm text-button font-medium">
                                    Lepas di sini
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
