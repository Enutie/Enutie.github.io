class Camera {
    constructor(){
        this.cameraTransitioning = false;
        this.timeSinceLastTransition;
        this.transitionDurationDefault = 500
        this.transitionDuration = this.transitionDurationDefault;
        this.autoUpdate = true;
        this.transitionTimeout;
        this.autoCameraTarget = null;

        this.directed_camera = false
    }

    panToDOMElement(ele, margin) {
        //setTimeout(() => {
        var temp = this;
        this.transitionDuration = this.transitionDurationDefault
        this.cameraTransitioning = true; 
        var bbox = ele.getBBox();
        var o = this.getCenterAndScaleOfBoundingBox(bbox, margin);
        this.panTo(o.center, o.scale);
       // }, 10) // HACK: if i dont wait it will sometimes pan to center of screen with nothing there, i think its because it has to render the DOM elements first
        
    }

    panToD3Node(ele, margin) {
        var DOMElement = d3.selectAll(".circle").nodes().filter(c => d3.select(c).data()[0] === ele)[0]
        this.panToDOMElement(DOMElement, margin)
    }

    panTo(p, scale) {
        if (scale > 3) {
            return; //selection of dom elements sometiems returning nothing and therefore its very zoomed into the center. this prevents that
        }
        var temp = this
        svg
            .transition()
            .duration(this.transitionDuration)
            .call(
                zoom.transform,
                d3.zoomIdentity.translate(p[0], p[1]).scale(scale)
            );
        
    }
    
    getCenterAndScaleOfBoundingBox(bbox, margin) {
        
          if (!margin) margin = 100;
          margin = 200;
          var bounds = [
              [bbox.x - margin, bbox.y - margin],
              [bbox.x + bbox.width + margin, bbox.y + bbox.height + margin]
              ];
          var dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = 0.9 / Math.max(dx / width, dy / height);
          return {center: [width / 2 - scale * x, height / 2 - scale * y], scale: scale};
    }

    SetFocus(list) {
        this.autoCameraTarget = list
        this.reFocus();
    }

    getBBoxFromList(list) {
        var x1 = list[0].x
        var y1 = list[0].y
        var x2 = list[0].x
        var y2 = list[0].y

        list.forEach(element => {
            if (element.x < x1) {
                x1 = element.x
            }
            if (element.y < y1) {
                y1 = element.y
            }
            if (element.x > x2) {
                x2 = element.x
            }
            if (element.y > y2) {
                y2 = element.y
            }
        });

        return {x: x1, y: y1, width: x2 - x1, height: y2 - y1}
    }

    reset() {
        svg
        .transition()
        .duration(0).call(zoom.transform, d3.zoomIdentity);
    }

    reFocus() {
        //if (!this.directed_camera) return;
        //this.autoCameraTarget = null;
        this.panToDOMElement(d3.selectAll(".everything").node())
        return;
        if (this.autoCameraTarget) {
            var o = this.getCenterAndScaleOfBoundingBox(this.getBBoxFromList(this.autoCameraTarget), 50);
            this.panTo(o.center, o.scale);
        } else {
            this.panToDOMElement(d3.selectAll(".everything").node())
            
        }

    }
    
}