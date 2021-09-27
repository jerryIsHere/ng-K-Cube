export function depthOfNode(node: any, tree: Tree): number {
    if (tree.value == node) {
        return 0
    }
    else if (tree.children.length > 0) {
        let leafDepth = tree.children.map(subTree => depthOfNode(node, subTree)).filter(d => d > -1)
        if (leafDepth.length == 0) return -1
        let depth = Math.min(...leafDepth)
        return depth + 1
    }
    return -1
}
export function depthOfTree(tree: Tree): number {
    if (tree.children.length == 0) return 1
    let leafDepth = tree.children.map(subTree => depthOfTree(subTree))
    return Math.max(...leafDepth) + 1
}
export class Tree {
    constructor(public value: any, public children: Tree[] = []) { }
    compare(b: any): boolean {
        return this.value == b
    }
}
export class angularTree {
    value: any
    children: angularTree[] = []
    angle: [number, number]
    constructor(tree: Tree, range: [number, number] = [0, 2 * Math.PI]) {
        this.children = tree.children.map((c, i) => {
            return new angularTree(c, [
                range[0] + i * range[1] / tree.children.length,
                range[0] + (i + 1) * range[1] / tree.children.length
            ])
        })
        this.value = tree.value
        this.angle = range
    }
    childrenAngle(value: any): [number, number] {
        if (this.value == value) {
            return this.angle
        }
        else if (this.children.length > 0) {
            let candidate = this.children.map(c => c.childrenAngle(value))
                .filter(angle => angle[1] > angle[0])
            if (candidate.length > 0) {
                candidate.sort((range1, range2) => {
                    let r1 = range1[1] - range1[0]
                    let r2 = range2[1] - range2[0]
                    return r1 - r2
                })
                return candidate[0]
            }
        }
        return [0, 0]
    }
}
export function layerOfTree(tree: Tree, index: number): Array<Tree> {
    let currentLayer: Array<Tree> = [tree]
    for (let i = 0; i < index; i++) {
        currentLayer = currentLayer.flatMap(b => b.children)
    }
    return currentLayer
}
export function treeize(triples: Array<Array<any>>, root_value: any): Tree {
    let tree: Tree = new Tree(root_value)

    let nodes: Set<any> = new Set()
    triples.forEach(t => {
        nodes.add(t[0])
        nodes.add(t[2])
    })
    tree.value = root_value
    nodes.delete(tree.value)

    let previousBranchs: Array<Tree> = [tree]
    let layerChildren: Set<Tree> = new Set()
    do {
        layerChildren = new Set()
        for (let branch of previousBranchs) {
            let branchDirectChildren: Array<Tree> = []
            triples.forEach(t => {
                if (branch.value == t[0] && nodes.has(t[2])) {
                    nodes.delete(t[2])
                    branchDirectChildren.push(
                        new Tree(t[2])
                    )
                }
                else if (branch.value == t[2] && nodes.has(t[0])) {
                    nodes.delete(t[0])
                    branchDirectChildren.push(
                        new Tree(t[0])
                    )
                }
            })
            branch.children = branch.children.concat(branchDirectChildren)
            branchDirectChildren.forEach(element => {
                layerChildren.add(element)
            });
        }
        previousBranchs = previousBranchs.flatMap(b => b.children)
    }
    while (layerChildren.size > 0)
    return tree
}