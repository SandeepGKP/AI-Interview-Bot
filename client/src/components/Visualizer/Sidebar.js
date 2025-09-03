import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

const Sidebar = ({ onSelectAlgorithm, toggleSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null); // State to manage open/closed categories

  const algorithms = {
    [t('searching_category')]: [t('binary_search_alg'), t('linear_search_alg')],
    [t('sorting_category')]: [t('bubble_sort_alg'), t('selection_sort_alg'), t('insertion_sort_alg'), t('quick_sort_alg')],
    [t('graph_category')]: [t('bfs_alg'), t('dfs_alg'), t('dijkstras_algorithm_alg'), t('prims_algorithm_alg'), t('kruskals_algorithm_alg')],
    [t('tree_category')]: [t('preorder_traversal_alg'), t('inorder_traversal_alg'), t('postorder_traversal_alg'), t('level_order_traversal_alg')],
    [t('stack_category')]: [t('stack_lifo_alg')], // New: Stack category
    [t('queue_category')]: [t('queue_fifo_alg')] // New: Queue category
  };

  // Helper to get the original algorithm name for onSelectAlgorithm
  const getOriginalAlgorithmName = (translatedAlgName) => {
    const allAlgs = {
      [t('binary_search_alg')]: 'Binary Search',
      [t('linear_search_alg')]: 'Linear Search',
      [t('bubble_sort_alg')]: 'Bubble Sort',
      [t('selection_sort_alg')]: 'Selection Sort',
      [t('insertion_sort_alg')]: 'Insertion Sort',
      // [t('merge_sort_alg')]: 'Merge Sort',
      [t('quick_sort_alg')]: 'Quick Sort',
      [t('bfs_alg')]: 'BFS',
      [t('dfs_alg')]: 'DFS',
      [t('dijkstras_algorithm_alg')]: "Dijkstra's Algorithm",
      [t('prims_algorithm_alg')]: "Prim's Algorithm",
      [t('kruskals_algorithm_alg')]: "Kruskal's Algorithm",
      [t('preorder_traversal_alg')]: 'Preorder Traversal',
      [t('inorder_traversal_alg')]: 'Inorder Traversal',
      [t('postorder_traversal_alg')]: 'Postorder Traversal',
      [t('level_order_traversal_alg')]: 'Level Order Traversal',
      [t('stack_lifo_alg')]: 'Stack (LIFO)', // New: Stack algorithm
      [t('queue_fifo_alg')]: 'Queue (FIFO)' // New: Queue algorithm
    };
    return allAlgs[translatedAlgName] || translatedAlgName;
  };

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleAlgorithmClick = (alg) => {
    onSelectAlgorithm(getOriginalAlgorithmName(alg));
    if (toggleSidebar) { // Close sidebar if toggleSidebar function is provided (for small screens)
      toggleSidebar();
    }
  };

  return (
    <div className="w-full lg:w-64 overflow-y-auto bg-gray-800 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl lg:text-2xl font-bold">
          <span className="text-purple-300 opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,#F87171,#FBBF24,#34D399,#3B82F6,#A78BFA)]">🧠AlgoViz</span>
        </h2>
        {toggleSidebar && ( // Show close button only on small screens when sidebar is an overlay
          <button onClick={toggleSidebar} className="text-white lg:hidden">
            <CloseIcon />
          </button>
        )}
      </div>

      <Button
        variant="outlined"
        sx={{ mb: 2, borderRadius: 2, width: 'fit-content', mx: 'auto' }}
        onClick={() => { navigate('/gallery'); if (toggleSidebar) toggleSidebar(); }}
      >
        <span className="font-bold opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,#F87171,#FBBF24,#34D399,#3B82F6,#A78BFA)]">{t('Gallery')}</span>
      </Button>

      <div className="flex-1"> {/* This div will allow the categories to scroll if needed */}
        {Object.entries(algorithms).map(([category, algs]) => (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-serif mb-2 flex items-center">
                <span className="text-purple-300 opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#F87171,_#FBBF24,_#34D399,_#3B82F6,_#A78BFA)]">{category}</span>
                <span className="ml-2 text-purple-300">{openCategory === category ? '▲' : '▼'}</span>
              </h3>
            </button>
            {openCategory === category && (
              <ul className="ml-4">
                {algs.map((alg) => (
                  <li key={alg} className="mb-1">
                    <button
                      onClick={() => handleAlgorithmClick(alg)}
                      className="text-blue-400 hover:text-blue-200 focus:outline-none"
                    >
                      <span className="text-purple-300 hover:text-blue-600 text-base opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,#F87171,#FBBF24,#34D399,#3B82F6,#A78BFA)]">{alg}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
