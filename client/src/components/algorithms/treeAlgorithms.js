// Helper class for Tree Node (assuming a simple binary tree for now)
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export const preorderTraversal = (root) => {
  const animations = [];
  const result = [];

  const traverse = (node) => {
    if (!node) return;
    animations.push({ type: 'visit', node: node.value });
    result.push(node.value);
    traverse(node.left);
    traverse(node.right);
  };

  traverse(root);
  return { traversal: result, animations: animations };
};

export const inorderTraversal = (root) => {
  const animations = [];
  const result = [];

  const traverse = (node) => {
    if (!node) return;
    traverse(node.left);
    animations.push({ type: 'visit', node: node.value });
    result.push(node.value);
    traverse(node.right);
  };

  traverse(root);
  return { traversal: result, animations: animations };
};

export const postorderTraversal = (root) => {
  const animations = [];
  const result = [];

  const traverse = (node) => {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    animations.push({ type: 'visit', node: node.value });
    result.push(node.value);
  };

  traverse(root);
  return { traversal: result, animations: animations };
};

export const levelOrderTraversal = (root) => {
  const animations = [];
  const result = [];
  if (!root) return { traversal: result, animations: animations };

  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    animations.push({ type: 'visit', node: node.value });
    result.push(node.value);

    if (node.left) {
      queue.push(node.left);
      animations.push({ type: 'enqueue', node: node.left.value, from: node.value });
    }
    if (node.right) {
      queue.push(node.right);
      animations.push({ type: 'enqueue', node: node.right.value, from: node.value });
    }
  }
  return { traversal: result, animations: animations };
};

// Example usage (for testing purposes, not part of the export)
/*
const tree = new TreeNode(1);
tree.left = new TreeNode(2);
tree.right = new TreeNode(3);
tree.left.left = new TreeNode(4);
tree.left.right = new TreeNode(5);

console.log("Preorder:", preorderTraversal(tree));
console.log("Inorder:", inorderTraversal(tree));
console.log("Postorder:", postorderTraversal(tree));
console.log("Level Order:", levelOrderTraversal(tree));
*/
