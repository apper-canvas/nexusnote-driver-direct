import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home({ darkMode, toggleDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspaces, setWorkspaces] = useState([
    { 
      id: '1', 
      name: 'Personal', 
      icon: 'Home',
      pages: [
        { id: '101', title: 'Getting Started', icon: 'BookOpen' },
        { id: '102', title: 'Tasks', icon: 'CheckSquare' },
        { id: '103', title: 'Journal', icon: 'BookText' }
      ]
    },
    { 
      id: '2', 
      name: 'Work', 
      icon: 'Briefcase',
      pages: [
        { id: '201', title: 'Project Alpha', icon: 'FileText' },
        { id: '202', title: 'Meeting Notes', icon: 'Calendar' },
        { id: '203', title: 'Ideas', icon: 'Lightbulb' }
      ]
    }
  ]);
  
  const [activePage, setActivePage] = useState({
    id: '101',
    title: 'Getting Started',
    content: ''
  });
  
  const HomeIcon = getIcon('Home');
  const BriefcaseIcon = getIcon('Briefcase');
  const BookOpenIcon = getIcon('BookOpen');
  const CheckSquareIcon = getIcon('CheckSquare');
  const FileTextIcon = getIcon('FileText');
  const BookTextIcon = getIcon('BookText');
  const CalendarIcon = getIcon('Calendar');
  const LightbulbIcon = getIcon('Lightbulb');
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const BellIcon = getIcon('Bell');
  const ChevronDownIcon = getIcon('ChevronDown');
  const SettingsIcon = getIcon('Settings');
  const UserIcon = getIcon('User');
  
  const getIconComponent = (iconName) => {
    const icons = {
      'Home': HomeIcon,
      'Briefcase': BriefcaseIcon,
      'BookOpen': BookOpenIcon,
      'CheckSquare': CheckSquareIcon,
      'FileText': FileTextIcon,
      'BookText': BookTextIcon,
      'Calendar': CalendarIcon,
      'Lightbulb': LightbulbIcon
    };
    
    const IconComponent = icons[iconName] || HomeIcon;
    return <IconComponent className="h-4 w-4" />;
  };
  
  const handlePageClick = (page) => {
    setActivePage({
      id: page.id,
      title: page.title,
      content: ''
    });
    
    // On mobile, close sidebar after selecting a page
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    
    toast.info(`Opened "${page.title}"`, {
      icon: "📄"
    });
  };
  
  const handleCreatePage = (workspaceId) => {
    const newPageId = `page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      title: 'Untitled',
      icon: 'FileText'
    };
    
    const updatedWorkspaces = workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        return {
          ...workspace,
          pages: [...workspace.pages, newPage]
        };
      }
      return workspace;
    });
    
    setWorkspaces(updatedWorkspaces);
    setActivePage({
      id: newPageId,
      title: 'Untitled',
      content: ''
    });
    
    toast.success("New page created", {
      icon: "✨"
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Toggle Button - Mobile Only */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-surface-800 shadow-soft"
        >
          {sidebarOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed md:relative z-20 w-64 md:w-72 h-full bg-surface-100 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 shadow-lg md:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                NoteTaker
              </h1>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Sidebar Search */}
          <div className="p-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 
                          bg-white dark:bg-surface-700 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-surface-400" />
            </div>
          </div>
          
          {/* Workspaces */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
            {workspaces.map(workspace => (
              <div key={workspace.id} className="mb-4">
                <div className="flex items-center justify-between px-2 py-1 text-sm font-medium text-surface-500 dark:text-surface-400">
                  <div className="flex items-center space-x-2">
                    {getIconComponent(workspace.icon)}
                    <span>{workspace.name}</span>
                  </div>
                  <button 
                    onClick={() => handleCreatePage(workspace.id)}
                    className="p-1 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-1 space-y-0.5">
                  {workspace.pages.map(page => (
                    <button
                      key={page.id}
                      onClick={() => handlePageClick(page)}
                      className={`w-full flex items-center px-3 py-1.5 rounded-md text-sm transition-colors
                                ${page.id === activePage.id 
                                  ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                                  : 'hover:bg-surface-200 dark:hover:bg-surface-700'}`}
                    >
                      <span className="mr-2">{getIconComponent(page.icon)}</span>
                      <span className="truncate">{page.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* User Section */}
          <div className="p-3 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">User Account</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">user@example.com</p>
              </div>
              <SettingsIcon className="h-4 w-4 text-surface-400" />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Nav */}
        <div className="h-14 border-b border-surface-200 dark:border-surface-700 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-surface-800">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">{activePage.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
              <BellIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-8 px-4 md:px-8">
            <MainFeature />
          </div>
        </div>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Home;