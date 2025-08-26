import { Select } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ onSelectAlgorithm }) => {
  const { t } = useTranslation();

  const algorithms = {
    [t('searching_category')]: [t('binary_search_alg'), t('linear_search_alg')],
    [t('sorting_category')]: [t('bubble_sort_alg'), t('selection_sort_alg'), t('insertion_sort_alg'), t('merge_sort_alg'), t('quick_sort_alg')],
    [t('graph_category')]: [t('bfs_alg'), t('dfs_alg'), t('dijkstras_algorithm_alg'), t('prims_algorithm_alg'), t('kruskals_algorithm_alg')],
    [t('tree_category')]: [t('preorder_traversal_alg'), t('inorder_traversal_alg'), t('postorder_traversal_alg'), t('level_order_traversal_alg')]
  };

  // Helper to get the original algorithm name for onSelectAlgorithm
  const getOriginalAlgorithmName = (translatedAlgName) => {
    const allAlgs = {
      [t('binary_search_alg')]: 'Binary Search',
      [t('linear_search_alg')]: 'Linear Search',
      [t('bubble_sort_alg')]: 'Bubble Sort',
      [t('selection_sort_alg')]: 'Selection Sort',
      [t('insertion_sort_alg')]: 'Insertion Sort',
      [t('merge_sort_alg')]: 'Merge Sort',
      [t('quick_sort_alg')]: 'Quick Sort',
      [t('bfs_alg')]: 'BFS',
      [t('dfs_alg')]: 'DFS',
      [t('dijkstras_algorithm_alg')]: 'Dijkstra\'s Algorithm',
      [t('prims_algorithm_alg')]: 'Prim\'s Algorithm',
      [t('kruskals_algorithm_alg')]: 'Kruskal\'s Algorithm',
      [t('preorder_traversal_alg')]: 'Preorder Traversal',
      [t('inorder_traversal_alg')]: 'Inorder Traversal',
      [t('postorder_traversal_alg')]: 'Postorder Traversal',
      [t('level_order_traversal_alg')]: 'Level Order Traversal'
    };
    return allAlgs[translatedAlgName] || translatedAlgName;
  };

  return (
    <div className="w-25 overflow-y-scroll bg-gray-800 p-4 h-full">
      <h2 className="mb-6"><span className="text-purple-300  text-6xl sm:text-3xl  opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,#F87171,#FBBF24,#34D399,#3B82F6,#A78BFA)]">🧠AlgoViz</span></h2>

      {Object.entries(algorithms).map(([category, algs]) => (
        <div key={category} className="mb-4 ml-10 ">

          <h3 className="text-xl font-medium mb-2"><span className="text-3xl sm:text-4xl lg:text-xl font-bold mt-2 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,_#F87171,_#FBBF24,_#34D399,_#3B82F6,_#A78BFA)]">{category}</span></h3>
          <Select sx={{
            // width:"3rem",
            fontSize: "0.8rem",      // smaller text
            minHeight: "22px",
            borderRadius: "16px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #3a3a60, #2a2a40)",
            color: "#fff",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover": { background: "linear-gradient(135deg, #2e2e4f, #3a3a60)" },
            "& .MuiSelect-icon": { fontSize: "2rem", color: "#FBBF24" },
            boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
          }}>
            {/* <ul> */}
            {algs.map((alg) => (
              <ul className="">
                <li key={alg} className="mb-1">
                  <button
                    onClick={() => onSelectAlgorithm(getOriginalAlgorithmName(alg))}
                    className="text-blue-400 hover:text-blue-200 focus:outline-none"
                  >
                    <span className="text-purple-300 hover:text-blue-600 text-xl sm:text-xl m-6 opacity-200 leading-tight text-transparent bg-clip-text 
             bg-[radial-gradient(circle_at_center,#F87171,#FBBF24,#34D399,#3B82F6,#A78BFA)]">{alg}</span>
                  </button>
                </li>
              </ul>
            ))}
            {/* </ul> */}
          </Select>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
