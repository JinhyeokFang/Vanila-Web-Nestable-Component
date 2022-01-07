class Component {
    _id;
    _parent;
    _child;
    _childDom = '';
    _props;
    _dom = '';
    _data = {};
    _events = [];

    constructor(parent, props, child) {
        this._id = 'el' + parseInt(Math.random() * 31415926535, 10).toString();
        this._parent = parent;
        this._props = props;
        this._child = child;
        if (this._child instanceof Component) {
            this._child.setParent(this);
        } else if (typeof this._child == 'string') {
            this._childDom = this._child;
            this._child = null;
        }
        this._data = this.data();
        this._render(false, false);
        this.onCreated();
    }

    _render(updatedByParent, updatedByChild) {
        this._dom = `
            <div id="${this._id}" class="autocreatedcustomcomponent">
                ${this.template(this._data, this._props, this._childDom)}
            </div>
        `

        if (updatedByParent == false) {
            if (this._parent instanceof HTMLElement) {
                this._parent.innerHTML = this._dom;
            } else if (this._parent instanceof Component) {
                this._parent.updateChild(this._dom);
            }
        }

        if (updatedByChild == false) {
            if (this._child instanceof Component) {
                this._child.updateParent();
            }
        }

        this._updateEventListener();
        this.onUpdated();
    }

    _updateEventListener() {
        for (let event of this._events) {
            document
                .querySelectorAll(`#${this._id} ${event.selector}:not(#${this._id} .autocreatedcustomcomponent *)`)
                .forEach(element => {
                    element.addEventListener(event.name, event.func);
                });
        }
    }

    setParent(parent) {
        this._parent = parent;
        this._parent.updateChild(this._dom);
        this._updateEventListener();
    }

    updateData(newData) {
        this._data = {
            ...this._data,
            ...newData(this._data)
        };
        this._render(false, false);
    }

    updateChild(childDom) {
        this._childDom = childDom;
        this._render(false, true);
    }

    updateParent() {
        this._render(true, false);
    }

    addEvent(selector, name, func) {
        this._events.push({
            selector, name, func
        });
        this._updateEventListener();
    }

    onCreated() {}
    onUpdated() {}
    template() {}
    data() {}
}

class MyComponent extends Component {
    template(data, props, child) {
        const { count } = data;
        const { message } = props;

        return `
            Component
            <br>
            ${ child ? `Child: <div style="border: 5px solid aqua">
                ${ child }
            </div>` : `` }
            <p> message: ${ message } </p>
            <h1>클릭 ${count}번</h1>
            <button class="click">클릭하기</button>
        `;
    }

    data() {
        return {
            count: 0
        };
    }

    onCreated() {
        this.addEvent('.click', 'click', e => {
            this.updateData(data => { 
                return {
                    count: data.count + 1
                }
            });
        });
    }
}

const appComponent = new MyComponent(
    document.querySelector("#app"),
    {
        message: '안녕하세요1'
    },
    new MyComponent(
        document.querySelector("#app"),
        {
            message: '안녕하세요2'
        },
        new MyComponent(
            document.querySelector("#app"),
            {
                message: '안녕하세요3'
            },
            new MyComponent(
                document.querySelector("#app"),
                {
                    message: '안녕하세요4'
                },
                new MyComponent(
                    document.querySelector("#app"),
                    {
                        message: '안녕하세요5'
                    },
                    new MyComponent(
                        document.querySelector("#app"),
                        {
                            message: '안녕하세요6'
                        },
                        null
                    )
                )
            )
        )
    )
);