import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ListTitle extends Component {
    click(e) {
        this.props.choose(this.props.index);
    }
    deleteList(e) {
        this.props.deleteList(this.props.index);
    }
    render() {
        return (
            <div className="inline">
            <div 
                className={this.props.className} 
                contentEditable={this.props.changable}
                onClick={(e)=>this.click(e)}
            >
                {this.props.name}
            </div>
                <button 
                    className={"button list-cross "+this.props.buttonClass}
                    onClick={(e)=>this.deleteList(e)}
                > x </button>
            </div>
        );
    }
}

class Listbar extends Component {
    chooseList = (index) => {
        this.props.chooseList(index);
    }
    deleteList = (index) => {
        this.props.deleteList(index);
    }
    addList(e) { this.props.addClick(); }
    render() {
        var listTitles=[];
        for (let i = 0; i < this.props.listBar.length; i++) {
            if (i === this.props.cur){
                listTitles.push(
                    <ListTitle
                        className="list-name current-list"
                        buttonClass="current-list-cross"
                        name={this.props.listBar[i].name} 
                        index={i} 
                        choose={this.chooseList}
                        deleteList={this.deleteList}
                        changable="true"
                    />
                );
            }else {
                listTitles.push(
                    <ListTitle
                        className="list-name"
                        buttonClass=""
                        name={this.props.listBar[i].name} 
                        index={i} 
                        choose={this.chooseList}
                        deleteList={this.deleteList}
                        changable="false"
                    />
                );
            }
        }
        return (
            <div id="list-bar" className="bar no-select">
                <div className="scrollable inline">
                {listTitles}
                </div>
                <div className="align-right inline">
                    <button 
                        className="button add" 
                        onClick={(e)=>this.addList(e)}
                    > + </button>
                </div>
            </div>
        );
    }
}

class ListItem extends Component {
    deleteItem(e) {
        this.props.deleteItem(this.props.index%100);
    }
    itemDone(e) {
        this.props.itemDone(this.props.index%100);
    }
    render() {
        var checkbox;
        if (this.props.done === true){
            checkbox = <input 
                            id={this.props.itemName+'-checkbox'+this.props.index}
                            type="checkbox" 
                            className="hide"
                            onClick={(e)=>this.itemDone(e)}
                            checked />
        }else {
            checkbox = <input 
                            id={this.props.itemName+'-checkbox'+this.props.index}
                            type="checkbox"
                            onClick={(e)=>this.itemDone(e)}
                            className="hide" />
        }
        return (
            <div className="item no-select">
                {checkbox}
                <label 
                    htmlFor={this.props.itemName+'-checkbox'+this.props.index} 
                    className="checkbox"
                ></label>
                <label 
                    htmlFor={this.props.itemName+'-checkbox'+this.props.index} 
                    className="checkmark"
                ></label>
                <li className="item-text">{this.props.itemName}</li>
                <div className="align-right-cross">
                    <button 
                        className="button cross" 
                        onClick={(e)=>this.deleteItem(e)}
                    > x </button>
                </div>
            </div>
        );
    }
}

class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        };
    }
    onKeyPressed(e) {
        if (e.keyCode === 229)  return;
        if (e.keyCode === 13) {
            if (this.state.inputValue === '') return;
            this.props.addItem(this.state.inputValue);
            e.target.value = '';
            this.setState({
                inputValue: ''
            });
        }
    }
    updateInputValue(e) {
        this.setState({
            inputValue: e.target.value
        });
    }
    render() {
        return (
            <input 
                type="text" 
                id="add-item" 
                className="add-item" 
                placeholder="What need to be done?"
                onKeyDown={(e)=>this.onKeyPressed(e)}
                onChange={(e)=>this.updateInputValue(e)}
            ></input>
        );
    }
}

class List extends Component {
    addItem = (itemName) => {
        this.props.addItem(this.props.index, itemName);
    }
    deleteItem = (index) => {
        this.props.deleteItem(this.props.index, index);
    }
    itemDone = (index) => {
        this.props.itemDone(this.props.index, index);
    }
    render() {
        var listItems=[];
        for (let i = 0; i < this.props.list.items.length; i++) {
            listItems.push(
                <ListItem 
                    itemName={this.props.list.items[i].name}
                    done={this.props.list.items[i].done}
                    deleteItem={this.deleteItem}
                    itemDone={this.itemDone}
                    index={this.props.index*100 + i}
                />
            );
        }
        return (
            <div className={this.props.className}>
                <AddItem 
                    listData={this.props.list.items} 
                    addItem={this.addItem} 
                />
                <div 
                    id={this.props.list.name+"-list"} 
                    className="list"
                >
                    <ul>
                        {listItems}
                    </ul>
                </div>
            </div>
        );
    }
}

class Footer extends Component {
    render() {
        let todos = 0, total = 0, done = 0;
        for (let i = 0; i < this.props.data.todoListData.length; ++i){
            let tmpList = this.props.data.todoListData[i].items;
            if (i === this.props.data.cur){
                todos = this.props.data.todoListData[i].items.length;
                for (let j = 0; j < tmpList.length; ++j) {
                    if (tmpList[j].done){
                        --todos;
                    }
                }
            }
            total += tmpList.length;
            for (let j = 0; j < tmpList.length; ++j) {
                if (tmpList[j].done){
                    ++done;
                }
            }
        }
        return (
            <div id="imformation">
                <footer className="information no-select">
                    <p className="footer"> Todos: {todos} </p>
                    <p className="footer"> Total todos: {total} </p>
                    <p className="footer"> Done: {done} </p>
                </footer>
            </div>
        );
    }
}

class Todolist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cur: 0,
            todoListData:[
                {   name: 'Life', 
                    items:[
                        {name: '讀完電機系', done: false}
                    ]
                }
            ]
        }
    }
    chooseList = (index) => {
        this.setState({
            cur: index
        });
    }
    deleteList = (index) => {
        let todolist = this.state.todoListData;
        todolist.splice(index, 1);
        this.setState({
            todoListData: todolist
        });
        let curIndex = index;
        if (curIndex === todolist.length) curIndex--;
        this.setState({
            cur: curIndex
        });
    }
    addItem = (i, itemName) => {
        let todolist = this.state.todoListData;
        todolist[i].items.push({name: itemName, done: false});
        this.setState({
            todoListData: todolist
        });
    }
    deleteItem = (i, index) => {
        let todolist = this.state.todoListData;
        todolist[i].items.splice(index, 1);
        this.setState({
            todoListData: todolist
        });
    }
    itemDone = (i, index) => {
        let todolist = this.state.todoListData;
        todolist[i].items[index].done = (!todolist[i].items[index].done);
        this.setState({
            todoListData: todolist
        });
    }
    addList = () => {
        let todolist = this.state.todoListData;
        todolist.push({name: 'New List', items:[]});
        this.setState({
            todoListData: todolist
        });
        this.chooseList((this.state.todoListData.length)-1);
    }
    render() {
        var lists=[];
        for (let i = 0; i < this.state.todoListData.length; i++) {
            if (i === this.state.cur){
                lists.push(
                    <List 
                        className={"ease"} 
                        list={this.state.todoListData[i]}
                        addItem={this.addItem}
                        deleteItem={this.deleteItem}
                        itemDone={this.itemDone}
                        index={i} 
                    />
                );
            }else {
                lists.push(
                    <List 
                        className={"ease hidden"} 
                        list={this.state.todoListData[i]} 
                        addItem={this.addItem} 
                        deleteItem={this.deleteItem}
                        itemDone={this.itemDone}
                        index={i} 
                    />
                );
            }
        }
        return (
            <div>
                <h1 className="no-select"> todos </h1>
                <Listbar 
                    listBar={this.state.todoListData} 
                    addClick={this.addList} 
                    chooseList={this.chooseList}
                    deleteList={this.deleteList}
                    cur={this.state.cur}
                />
                {lists}
                <Footer data={this.state}/>
            </div>
        );
    }
}

ReactDOM.render(<Todolist />, document.getElementById('root'));