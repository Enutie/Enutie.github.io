insert (node, root) {
    if (h == null) 
    {
        return node;
    }
    if      (node.value < h.value) {
        h.left = insert(node, h.left);
    }
    else if (node.value > h.value) {
        h.right = insert(node, h.left);
    }
    else {
        h.value = node.value;
    }
    return h;
}