(function() {
    var DRAG_THRESHOLD, Draggable, DropTarget, DropTargets, Example, LEFT_BUTTON, SourceObject, SourceObjects, div, p, ref,
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    ref = React.DOM, div = ref.div, p = ref.p;

    LEFT_BUTTON = 0;

    DRAG_THRESHOLD = 3;

    document.addEventListener('DOMContentLoaded', function() {
        return React.renderComponent(Example(), document.body);
    });

    Example = React.createClass({
        getInitialState: function() {
            return {
                currentDragItem: null
            };
        },
        render: function() {
            return div({
                className: "dnd-example " + (this.state.currentDragItem ? 'dragging' : void 0),
                children: [
                    SourceObjects({
                        onDragStart: this.onDragStart,
                        onDragStop: this.onDragStop
                    }), DropTargets({
                        currentDragItem: this.state.currentDragItem,
                        onDrop: this.onDrop
                    }), this.dropDescription()
                ]
            });
        },
        onDragStart: function(details) {
            return this.setState({
                currentDragItem: details
            });
        },
        onDragStop: function() {
            return this.setState({
                currentDragItem: null
            });
        },
        onDrop: function(target) {
            return this.setState({
                lastDrop: {
                    source: this.state.currentDragItem,
                    target: target
                }
            });
        },
        dropDescription: function() {
            var drop;
            if (drop = this.state.lastDrop) {
                return p({
                    className: 'drop-description',
                    children: "Dropped source " + drop.source.type + "-" + drop.source.index + " on target " + drop.target.index
                });
            }
        }
    });

    SourceObjects = React.createClass({
        render: function() {
            var i, object;
            return div({
                className: 'dnd-source-objects',
                children: (function() {
                    var j, len, ref1, results;
                    ref1 = this.objects();
                    results = [];
                    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
                        object = ref1[i];
                        results.push(SourceObject({
                            type: object.type,
                            index: i + 1,
                            children: i + 1,
                            onDragStart: this.props.onDragStart,
                            onDragStop: this.props.onDragStop
                        }));
                    }
                    return results;
                }).call(this)
            });
        },
        objects: function() {
            var i;
            return _.flatten([
                (function() {
                    var j, results;
                    results = [];
                    for (i = j = 0; j <= 2; i = ++j) {
                        results.push({
                            type: 'green'
                        });
                    }
                    return results;
                })(), (function() {
                    var j, results;
                    results = [];
                    for (i = j = 0; j <= 2; i = ++j) {
                        results.push({
                            type: 'blue'
                        });
                    }
                    return results;
                })()
            ]);
        }
    });

    SourceObject = React.createClass({
        render: function() {
            return Draggable({
                className: "dnd-source-object " + this.props.type,
                children: this.props.children,
                onDragStart: this.props.onDragStart,
                onDragStop: this.props.onDragStop,
                dragData: this.dragData
            });
        },
        dragData: function() {
            return {
                type: this.props.type,
                index: this.props.index
            };
        }
    });

    Draggable = React.createClass({
        getInitialState: function() {
            return {
                mouseDown: false,
                dragging: false
            };
        },
        render: function() {
            return this.transferPropsTo(div({
                style: this.style(),
                className: "dnd-draggable " + (this.state.dragging ? 'dragging' : void 0),
                children: this.props.children,
                onMouseDown: this.onMouseDown
            }));
        },
        style: function() {
            if (this.state.dragging) {
                return {
                    position: 'absolute',
                    left: this.state.left,
                    top: this.state.top
                };
            } else {
                return {};
            }
        },
        onMouseDown: function(event) {
            var pageOffset;
            if (event.button === LEFT_BUTTON) {
                event.stopPropagation();
                this.addEvents();
                pageOffset = this.getDOMNode().getBoundingClientRect();
                return this.setState({
                    mouseDown: true,
                    originX: event.pageX,
                    originY: event.pageY,
                    elementX: pageOffset.left,
                    elementY: pageOffset.top
                });
            }
        },
        onMouseMove: function(event) {
            var base, base1, deltaX, deltaY, distance;
            deltaX = event.pageX - this.state.originX;
            deltaY = event.pageY - this.state.originY;
            distance = Math.abs(deltaX) + Math.abs(deltaY);
            if (!this.state.dragging && distance > DRAG_THRESHOLD) {
                this.setState({
                    dragging: true
                });
                if (typeof(base = this.props).onDragStart === "function") {
                    base.onDragStart(typeof(base1 = this.props).dragData === "function" ? base1.dragData() : void 0);
                }
            }
            if (this.state.dragging) {
                return this.setState({
                    left: this.state.elementX + deltaX + document.body.scrollLeft,
                    top: this.state.elementY + deltaY + document.body.scrollTop
                });
            }
        },
        onMouseUp: function() {
            this.removeEvents();
            if (this.state.dragging) {
                this.props.onDragStop();
                return this.setState({
                    dragging: false
                });
            }
        },
        addEvents: function() {
            document.addEventListener('mousemove', this.onMouseMove);
            return document.addEventListener('mouseup', this.onMouseUp);
        },
        removeEvents: function() {
            document.removeEventListener('mousemove', this.onMouseMove);
            return document.removeEventListener('mouseup', this.onMouseUp);
        }
    });

    DropTargets = React.createClass({
        render: function() {
            var i, target;
            return div({
                className: 'dnd-drop-targets',
                children: (function() {
                    var j, len, ref1, results;
                    ref1 = this.targets();
                    results = [];
                    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
                        target = ref1[i];
                        results.push(DropTarget({
                            target: target,
                            index: i,
                            currentDragItem: this.props.currentDragItem,
                            onDrop: this.props.onDrop
                        }));
                    }
                    return results;
                }).call(this)
            });
        },
        targets: function() {
            return [{
                accepts: ['blue']
            }, {
                accepts: ['green']
            }, {
                accepts: ['blue', 'green']
            }, {
                accepts: []
            }];
        }
    });

    DropTarget = React.createClass({
        getInitialState: function() {
            return {
                hover: false
            };
        },
        render: function() {
            return div({
                className: this.classes(),
                children: 'accepts ' + this.acceptsDescription(),
                onMouseEnter: (function(_this) {
                    return function() {
                        return _this.setState({
                            hover: true
                        });
                    };
                })(this),
                onMouseLeave: (function(_this) {
                    return function() {
                        return _this.setState({
                            hover: false
                        });
                    };
                })(this),
                onMouseUp: this.onDrop
            });
        },
        classes: function() {
            return ['dnd-drop-target', "" + (this.props.target.accepts.join(' ')), this.active() ? 'active' : void 0, this.active() && this.props.currentDragItem.type === 'green' ? 'active-green' : void 0, this.active() && this.props.currentDragItem.type === 'blue' ? 'active-blue' : void 0, this.disabled() ? 'disabled' : void 0, this.state.hover ? 'hover' : void 0].join(' ');
        },
        active: function() {
            var item, ref1;
            item = this.props.currentDragItem;
            return item && (ref1 = item.type, indexOf.call(this.props.target.accepts, ref1) >= 0);
        },
        disabled: function() {
            var item, ref1;
            item = this.props.currentDragItem;
            return item && (ref1 = item.type, indexOf.call(this.props.target.accepts, ref1) < 0);
        },
        acceptsDescription: function() {
            if (this.props.target.accepts.length > 0) {
                return this.props.target.accepts.join(' & ');
            } else {
                return 'nothing';
            }
        },
        onDrop: function() {
            var base;
            if (this.active()) {
                return typeof(base = this.props).onDrop === "function" ? base.onDrop({
                    index: this.props.index + 1
                }) : void 0;
            }
        }
    });

}).call(this);