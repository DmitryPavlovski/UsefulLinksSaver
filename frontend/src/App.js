import React, { Component } from "react";
import AddLinkModal from "./components/AddLinkModal";
import GroupSideBar from "./components/GroupSideBar";
import axios from "axios";
import { Trash, Eye, Pencil, ArrowBarRight, ArrowBarLeft } from 'react-bootstrap-icons';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarActive: false,
            activeGroupItem: {
                title: "",
                id: null
            },
            activeItem: {
                title: "",
                description: "",
                url: "",
                groupId: ""
            },
            linkList: [],
            groupLinksList: [],
            ifraimeUrl: "",
            contentActive:true
        };
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList = () => {
        axios
            .get("api/links/")
            .then(res => this.setState({ linkList: res.data }))
            .catch(err => console.log(err));
        axios
            .get("api/groups_links/")
            .then(res => this.setState({ groupLinksList: res.data }))
            .catch(err => console.log(err));
    };
    displayGroup = item => {
        return this.setState({ activeGroupItem: item });
    };
    renderItems = () => {
        const { activeGroupItem } = this.state;
        const newItems = this.state.linkList.filter(
            item => item.groupId === activeGroupItem.id
        );
        return newItems.map(item => (
            <li onDrop={event => {this.drop(event)}} onDragOver={event => {this.allowDrop(event)}} draggable={true} onDragStart={event => {this.drag(event)}}
                key={item.id}
                className={`list-group-item ${this.state.activeItem.id === item.id ? "active" : ""}`}>
                <div className="mx-0 p-1">
                    <div className="card-body p-1" title={item.description}>
                        <h5 className="card-title mb-0 mx-0">{item.title}</h5>
                        <div className="mx-0">
                            <a className="card-subtitle mb-0 mt-0 text-muted mx-0 text-truncate d-block display-8" key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                        </div>
                        <div className="row-xs mx-0">
                            <button
                                onClick={() => this.editLinkItem(item)}
                                className="btn btn-secondary ml-1 card-link"
                            >
                                <Pencil/>
                            </button>
                            <button
                                onClick={() => this.handlePreview(item)}
                                className="btn btn-link ml-1 card-link"
                            >
                                <Eye/>
                            </button>
                            <button
                                onClick={() => this.handleLinkDelete(item)}
                                className="btn btn-danger ml-1 card-link"
                            >
                                <Trash/>
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        ));
    };
    toggleAddLinkModal = () => {
        this.setState({ addLinkModal: !this.state.addLinkModal });
    };
    handleLinkSubmit = item => {
        this.toggleAddLinkModal();
        if (item.id) {
            axios
                .put(`api/links/${item.id}/`, item)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("api/links/", item)
            .then(res => this.refreshList());
    };
    handleLinkDelete = item => {
        axios
            .delete(`api/links/${item.id}`)
            .then(res => this.refreshList());
    };
    handlePreview = item => {
        this.setState({ ifraimeUrl: item.url, activeItem: item });
    }
    createLinkItem = () => {
        const item = { title: "", description: "", groupId: this.state.activeGroupItem.id, url: "" };
        this.setState({ activeItem: item, addLinkModal: !this.state.addLinkModal });
    };
    editLinkItem = item => {
        this.setState({ activeItem: item, addLinkModal: !this.state.addLinkModal });
    };
    sidebarCollapseClick = () => {
        this.setState({ sidebarActive: !this.state.sidebarActive })
    };

    allowDrop = ev => {
        ev.preventDefault();
        console.log(ev);
      };
      
    drag = ev => {
        debugger;
        console.log(ev);
      };
      
    drop = ev => {
        debugger;
        ev.preventDefault();
        console.log(ev);
          };
    render() {
        return (
            <main>
                <div className="wrapper">
                    <nav id="sidebar" className={this.state.sidebarActive ? "active" : ""}>
                        <GroupSideBar
                            setGroup={this.displayGroup}
                            refreshList={this.refreshList} />
                    </nav>
                    <div id="content" className={!this.state.contentActive ? " active" : ""}>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <div className="container-fluid">
                                <button type="button" id="sidebarCollapse" className={`navbar-btn ${this.state.sidebarActive ? " active" : ""}`} onClick={this.sidebarCollapseClick}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                                <button onClick={this.createLinkItem} className="btn btn-primary ml-4 add-button">
                                    Add link
                                </button>
                            </div>
                        </nav>
                        <div className="link-list">
                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                        </div>
                        {this.state.addLinkModal ? (
                            <AddLinkModal
                                activeItem={this.state.activeItem}
                                groupLinksList={this.state.groupLinksList}
                                toggle={this.toggleAddLinkModal}
                                onSave={this.handleLinkSubmit}
                            />
                        ) : null}
                    </div>
                    <div className="link-sidebar" onClick={()=>{this.setState({contentActive: !this.state.contentActive})}}>
                        <div className="hidder">
                            {!this.state.contentActive ? <ArrowBarRight /> : <ArrowBarLeft/>}
                        </div>
                    </div>
                    <div id="iframe" className="iframe-container" style={{ width:'100%'}}>
                    {this.state.ifraimeUrl ? (
                        <iframe 
                            ref="iframe" 
                            src={this.state.ifraimeUrl}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                        />
                    ) : null}
                    </div>
                </div>
            </main>
        );
    }
}
export default App;