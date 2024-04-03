import * as go from "gojs";

class MultiNodePathLink extends go.Link {
    // ignores this.routing, this.adjusting, this.corner, this.smoothness, this.curviness
    computePoints() {
        // get the list of Nodes that should be along the path
        const nodes = [];
        if (this.fromNode !== null && this.fromNode.location.isReal()) {
            nodes.push(this.fromNode);
        }

        const midkeys = this.data.path;
        if (Array.isArray(midkeys)) {
            const diagram = this.diagram;
            for (let i = 0; i < midkeys.length; i++) {
                const node = diagram.findNodeForKey(midkeys[i]);
                if (node instanceof go.Node && node.location.isReal()) {
                    nodes.push(node);
                    let set = node._PathLinks;
                    if (!set) set = node._PathLinks = new go.Set();
                    set.add(this);
                }
            }
        }
        if (this.toNode !== null && this.toNode.location.isReal()) {
            nodes.push(this.toNode);
        }

        // now do the routing
        this.clearPoints();

        const entity = this.diagram.findNodeForKey(this.data.entity);
        const cx = entity.location.x;
        const cy = entity.location.y;

        nodes.sort((a,b) => {
            const ax = a.location.x;
            const ay = a.location.y;
            const bx = b.location.x;
            const by = b.location.y;
            return angle(ax,ay,cx,cy) - angle(bx,by,cx,cy);
        })

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const center = new go.Point(node.location.x + node.actualBounds.width / 2, node.location.y + node.actualBounds.height / 2);
            this.addPoint(center);
        }

        return true;
    }
}

function angle(x, y, cx, cy) {
    const dx = x - cx;
    const dy = y - cy;
    return Math.atan(dx / dy);
}

export function invalidateLinkRoutes(e) {
    if (e.change === go.ChangedEvent.Property && e.propertyName === "location" && e.object instanceof go.Node) {
        // when a Node is moved, invalidate the route for all MultiNodePathLinks that go through it
        const diagram = e.diagram;
        const node = e.object;
        if (node._PathLinks) {
            node._PathLinks.each(l => l.invalidateRoute());
        }
    } else if (e.change === go.ChangedEvent.Remove && e.object instanceof go.Layer) {
        // when a Node is deleted that has MultiNodePathLinks going through it, invalidate those link routes
        if (e.oldValue instanceof go.Node) {
            const node = e.oldValue;
            if (node._PathLinks) {
                node._PathLinks.each(l => l.invalidateRoute());
            }
        } else if (e.oldValue instanceof MultiNodePathLink) {
            // when deleting a MultiNodePathLink, remove all references to it in Node._PathLinks
            const link = e.oldValue;
            const diagram = e.diagram;
            const midkeys = link.data.path;
            if (Array.isArray(midkeys)) {
                for (let i = 0; i < midkeys.length; i++) {
                    const node = diagram.findNodeForKey(midkeys[i]);
                    if (node !== null && node._PathLinks) node._PathLinks.remove(link);
                }
            }
        }
    }
}

export default MultiNodePathLink;