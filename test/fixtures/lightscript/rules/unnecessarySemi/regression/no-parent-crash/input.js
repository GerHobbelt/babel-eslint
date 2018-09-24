export traverse(rootNode, enter, exit, k, i) ->
  enter(rootNode, k, i)
  if rootNode~looseNotEq(null):
    for const key in rootNode:
      if key[0] === "_": continue
      val = rootNode[key]
      if val:
        if val.type:
          traverse(val, enter, exit, key);
        elif Array.isArray(val):
          for idx i, elem x in val: traverse(x, enter, exit, key, i)
  exit(rootNode, k, i)

export flatten(rootNode, finishNode) ->
  let idx = 0, indentLevel = 0, nodes = []

  traverse(
    rootNode
    (node, k, i) ->
      entry = {
        indentLevel, idx
        type: node?.type or "null"
        key: k, index: i
        node: node or { type: "null" }
      }
      nodes.push(finishNode(entry))
      idx++
      indentLevel++
    -> indentLevel--
  )

  nodes

export buildFlatTree(root, activeNode, buildNode) ->
  if root:
    flatten(root, buildNode)
  else:
    []

export describeNode(node) ->
  match node.type:
    | 'Identifier': `\`${node.name}\``
    | 'StringLiteral': `"${node.value}"`
    | 'NumericLiteral': `#${node.value}#`
    | 'BinaryExpression': `BinaryExpression(${node.operator})`
    | 'UnaryExpression': `UnaryExpression(${node.operator})`
    | else: node.type
