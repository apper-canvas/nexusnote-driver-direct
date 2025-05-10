import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Define icons at top of component
  const TypeIcon = getIcon('Type');
  const ImageIcon = getIcon('Image');
  const ListIcon = getIcon('List');
  const CheckSquareIcon = getIcon('CheckSquare');
  const CodeIcon = getIcon('Code');
  const TableIcon = getIcon('Table');
  const PlusIcon = getIcon('Plus');
  const GripVerticalIcon = getIcon('GripVertical');
  const TrashIcon = getIcon('Trash');
  const DragIcon = getIcon('Move');
  const BoldIcon = getIcon('Bold');
  const ItalicIcon = getIcon('Italic');
  const UnderlineIcon = getIcon('Underline');
  const LinkIcon = getIcon('Link');
  const PaletteIcon = getIcon('Palette');
  
  // Block states
  const blockTypes = [
    { id: 'text', name: 'Text', icon: TypeIcon },
    { id: 'heading', name: 'Heading', icon: TypeIcon },
    { id: 'list', name: 'List', icon: ListIcon },
    { id: 'todo', name: 'To-do', icon: CheckSquareIcon },
    { id: 'code', name: 'Code', icon: CodeIcon },
    { id: 'image', name: 'Image', icon: ImageIcon },
    { id: 'table', name: 'Table', icon: TableIcon },
  ];
  
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'heading', content: 'Welcome to NexusNote', level: 1 },
    { id: '2', type: 'text', content: 'This is a versatile document editor that allows you to create rich, interactive content.' },
    { id: '3', type: 'todo', content: 'Try creating a new block below', checked: false },
    { id: '4', type: 'todo', content: 'Edit existing blocks by clicking on them', checked: false },
    { id: '5', type: 'todo', content: 'Rearrange blocks by dragging them', checked: false },
  ]);
  
  const [activeBlock, setActiveBlock] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  
  const blockRefs = useRef({});
  const menuRef = useRef(null);
  
  // Handle click outside to close menus/reset states
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
      
      // Check if click is outside any block
      let clickedInBlock = false;
      Object.values(blockRefs.current).forEach(ref => {
        if (ref && ref.contains(event.target)) {
          clickedInBlock = true;
        }
      });
      
      if (!clickedInBlock && activeBlock) {
        setActiveBlock(null);
        setToolbarVisible(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeBlock]);
  
  // Block activation handler
  const handleBlockClick = (e, blockId) => {
    if (activeBlock === blockId) return;
    setActiveBlock(blockId);
    setToolbarVisible(true);
  };
  
  // Add a new block after the current one
  const addBlock = (afterId, type = 'text') => {
    const newBlock = { 
      id: `block-${Date.now()}`, 
      type, 
      content: '',
      ...(type === 'heading' ? { level: 2 } : {}),
      ...(type === 'todo' ? { checked: false } : {}),
    };
    
    const index = blocks.findIndex(block => block.id === afterId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    
    setBlocks(newBlocks);
    setActiveBlock(newBlock.id);
    setMenuVisible(false);
    
    // Focus the new block after render
    setTimeout(() => {
      if (blockRefs.current[newBlock.id]) {
        blockRefs.current[newBlock.id].focus();
      }
    }, 0);
    
    toast.success(`Added ${type} block`, {
      icon: "✨"
    });
  };
  
  // Show the block type menu
  const showBlockMenu = (e, blockId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left,
      y: rect.bottom + 5
    });
    
    setActiveBlock(blockId);
    setMenuVisible(true);
  };
  
  // Update block content
  const updateBlockContent = (id, content) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };
  
  // Update checkbox status for todo blocks
  const toggleTodoCheck = (id) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, checked: !block.checked } : block
    ));
  };
  
  // Delete block
  const deleteBlock = (id) => {
    if (blocks.length <= 1) {
      toast.error("Cannot delete the last block", {
        icon: "🛑"
      });
      return;
    }
    
    setBlocks(blocks.filter(block => block.id !== id));
    setActiveBlock(null);
    setToolbarVisible(false);
    
    toast.info("Block deleted", {
      icon: "🗑️"
    });
  };
  
  // Drag and drop functionality
  const handleDragStart = (e, id) => {
    setDraggedBlock(id);
    // Set drag image to be transparent
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  
  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== draggedBlock) {
      setDragOverId(id);
    }
  };
  
  const handleDragEnd = () => {
    if (draggedBlock && dragOverId && draggedBlock !== dragOverId) {
      const draggedIndex = blocks.findIndex(block => block.id === draggedBlock);
      const dropIndex = blocks.findIndex(block => block.id === dragOverId);
      
      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(dropIndex, 0, movedBlock);
      
      setBlocks(newBlocks);
      toast.info("Block rearranged", {
        icon: "🔄"
      });
    }
    
    setDraggedBlock(null);
    setDragOverId(null);
  };
  
  const getPlaceholderText = (blockType) => {
    const placeholders = {
      text: 'Type something...',
      heading: 'Heading',
      list: 'List item',
      todo: 'To-do item',
      code: 'Code block',
      image: 'Image description',
      table: 'Table content'
    };
    
    return placeholders[blockType] || 'Type something...';
  };
  
  const renderBlock = (block) => {
    const isActive = activeBlock === block.id;
    const isDraggedOver = dragOverId === block.id;
    const isDragging = draggedBlock === block.id;
    
    const blockClasses = `
      group relative flex items-start gap-2 w-full p-2 my-1.5 rounded-lg
      ${isActive ? 'ring-2 ring-primary/30' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}
      ${isDraggedOver ? 'border-t-2 border-primary' : ''}
      ${isDragging ? 'opacity-50' : 'opacity-100'}
      transition-all duration-150
    `;
    
    // Handle key events (e.g., Enter to create new block)
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addBlock(block.id);
      }
    };
    
    // Different content based on block type
    const renderBlockContent = () => {
      switch (block.type) {
        case 'heading':
          return (
            <div className="flex-1">
              {block.level === 1 && (
                <div
                  ref={el => blockRefs.current[block.id] = el}
                  contentEditable
                  suppressContentEditableWarning
                 dir="ltr"
                  className="text-2xl md:text-3xl font-bold outline-none"
                  placeholder={getPlaceholderText(block.type)}
                  onInput={(e) => updateBlockContent(block.id, e.currentTarget.textContent)}
                  onKeyDown={handleKeyDown}
                >
                  {block.content}
                </div>
              )}
              {block.level === 2 && (
                <div
                  ref={el => blockRefs.current[block.id] = el}
                  contentEditable
                  suppressContentEditableWarning
                 dir="ltr"
                  className="text-xl md:text-2xl font-semibold outline-none"
                  placeholder={getPlaceholderText(block.type)}
                  onInput={(e) => updateBlockContent(block.id, e.currentTarget.textContent)}
                  onKeyDown={handleKeyDown}
                >
                  {block.content}
                </div>
              )}
              {block.level === 3 && (
                <div
                  ref={el => blockRefs.current[block.id] = el}
                  contentEditable
                  suppressContentEditableWarning
                 dir="ltr"
                  className="text-lg md:text-xl font-medium outline-none"
                  placeholder={getPlaceholderText(block.type)}
                  onInput={(e) => updateBlockContent(block.id, e.currentTarget.textContent)}
                  onKeyDown={handleKeyDown}
                >
                  {block.content}
                </div>
              )}
            </div>
          );
          
        case 'todo':
          return (
            <div className="flex items-start gap-2 flex-1">
              <button 
                onClick={() => toggleTodoCheck(block.id)}
                className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border ${
                  block.checked 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-surface-300 dark:border-surface-600'
                } transition-colors duration-200`}
              >
                {block.checked && (
                  <CheckSquareIcon className="w-4 h-4" />
                )}
              </button>
              <div
                ref={el => blockRefs.current[block.id] = el}
                contentEditable
                suppressContentEditableWarning
               dir="ltr"
                className={`flex-1 outline-none ${block.checked ? 'line-through text-surface-400' : ''}`}
                placeholder={getPlaceholderText(block.type)}
                onInput={(e) => updateBlockContent(block.id, e.currentTarget.textContent)}
                onKeyDown={handleKeyDown}
              >
                {block.content}
              </div>
            </div>
          );
          
        default:
          return (
            <div
              ref={el => blockRefs.current[block.id] = el}
              contentEditable
              suppressContentEditableWarning
             dir="ltr"
              className="flex-1 outline-none"
              placeholder={getPlaceholderText(block.type)}
              onInput={(e) => updateBlockContent(block.id, e.currentTarget.textContent)}
              onKeyDown={handleKeyDown}
            >
              {block.content}
            </div>
          );
      }
    };
    
    return (
      <div 
        key={block.id}
        className={blockClasses}
        onClick={(e) => handleBlockClick(e, block.id)}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragOver={(e) => handleDragOver(e, block.id)}
        onDragEnd={handleDragEnd}
        data-block-id={block.id}
      >
        {/* Block handle - visible on hover and when active */}
        <div 
          className={`
            absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 p-1 
            opacity-0 ${isActive || isDragging ? 'opacity-100' : 'group-hover:opacity-70'}
            transition-opacity duration-200
          `}
        >
          <div className="cursor-move text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
            <DragIcon className="h-4 w-4" />
          </div>
        </div>
        
        {renderBlockContent()}
        
        {/* Block actions - visible on hover and when active */}
        <div 
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1
            opacity-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-70'}
            transition-opacity duration-200
          `}
        >
          <button
            onClick={(e) => showBlockMenu(e, block.id)}
            className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteBlock(block.id)}
            className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };
  
  // Format toolbar for text editing
  const renderFormatToolbar = () => {
    const activeBlockData = blocks.find(block => block.id === activeBlock);
    
    if (!activeBlockData || !['text', 'heading'].includes(activeBlockData.type)) {
      return null;
    }
    
    return (
      <AnimatePresence>
        {toolbarVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-4 -top-10 bg-white dark:bg-surface-700 shadow-soft rounded-lg flex items-center p-1 z-10"
          >
            <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-600">
              <BoldIcon className="h-3.5 w-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-600">
              <ItalicIcon className="h-3.5 w-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-600">
              <UnderlineIcon className="h-3.5 w-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-600">
              <LinkIcon className="h-3.5 w-3.5" />
            </button>
            <div className="h-4 w-px bg-surface-200 dark:bg-surface-600 mx-1"></div>
            <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-600">
              <PaletteIcon className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  // Block type selection menu
  const renderBlockTypeMenu = () => {
    return (
      <AnimatePresence>
        {menuVisible && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="fixed z-50 bg-white dark:bg-surface-800 shadow-soft rounded-lg overflow-hidden w-52"
            style={{
              left: `${menuPosition.x}px`,
              top: `${menuPosition.y}px`
            }}
          >
            <div className="p-2">
              <div className="text-sm font-medium text-surface-500 dark:text-surface-400 px-2 py-1">
                Add Block
              </div>
              <div className="mt-1 space-y-1">
                {blockTypes.map((type) => (
                  <button
                    key={type.id}
                    className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    onClick={() => addBlock(activeBlock, type.id)}
                  >
                    <span className="text-surface-500"><type.icon className="h-4 w-4" /></span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  // Add block button at the bottom of the page
  const renderAddBlockButton = () => {
    const lastBlockId = blocks.length > 0 ? blocks[blocks.length - 1].id : null;
    
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            if (lastBlockId) {
              showBlockMenu(e, lastBlockId);
            } else {
              setMenuPosition({
                x: e.clientX,
                y: e.clientY
              });
              setMenuVisible(true);
            }
          }}
          className="mt-4 px-4 py-2 w-full text-left text-surface-500 dark:text-surface-400 rounded-lg border border-dashed border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <div className="flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            <span>Add a block</span>
          </div>
        </button>
      </div>
    );
  };
  
  return (
    <div className="relative">
      <div className="mb-8">
        {blocks.map(block => renderBlock(block))}
        {renderAddBlockButton()}
      </div>
      
      {renderFormatToolbar()}
      {renderBlockTypeMenu()}
    </div>
  );
}

export default MainFeature;