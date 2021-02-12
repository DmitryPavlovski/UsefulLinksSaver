import React, { Component } from "react";
import LinkModal from "./components/LinkModal";
import GroupSideBar from "./components/GroupSideBar";
import ContentNavBar from "./components/ContentNavBar";
import axios from "axios";
import { Trash, Pencil, ArrowBarRight, ArrowBarLeft } from 'react-bootstrap-icons';
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
            activeItem: {id: null},
            linkList: [],
            groupLinksList: [],
            ifraimeUrl: "",
            contentActive:true,
            dragItem: {id:""}
        };
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList = () => {
        axios
            .get("api/links/")
            .then(res => this.setState({ linkList: res.data.sort(item => { return new Date() - new Date(item.createdOn)})}))
            .catch(err => console.log(err));        
    };
    displayGroup = item => {
        return this.setState({ activeGroupItem: item });
    };
    dragEnd = () => {
        this.setState({dragItem:{id:""}});
    } 
    renderItems = () => {
        const { activeGroupItem } = this.state;
        const newItems = this.state.linkList.filter(
            item => item.groupId === activeGroupItem.id
        );
        return newItems.map(item => (
            <li draggable={true}
                onDragStart={ () => {this.drag(item)}}
                onDragEnd={this.dragEnd}
                key={item.id}
                onClick={() => this.handlePreview(item)}
                className={`list-group-item ${this.state.activeItem.id === item.id ? "active" : ""} ${this.state.dragItem.id === item.id ? "draging":""}`}>
                <div className="mx-0 p-1">
                    <div className="card-body p-1" title={item.description}>
                        <h5 className="card-title mb-0 mx-0">{item.title}</h5>
                        <div className="mx-0">
                            <a className="card-subtitle mb-0 mt-0 text-muted mx-0 text-truncate d-block display-8" key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                        </div>
                        {this.state.contentActive ?
                        <div className="row-xs mx-0">
                            <button
                                onClick={() => this.editLinkItem(item)}
                                className="btn btn-secondary ml-1 card-link py-0 px-1"
                            >
                                <Pencil/>
                            </button>
                            <button
                                onClick={() => this.handleLinkDelete(item)}
                                className="btn btn-danger ml-1 card-link py-0 px-1 float-sm-right"
                            >
                                <Trash/>
                            </button>
                        </div> : null}
                    </div>
                </div>
            </li>
        ));
    };
    toggleLinkModal = () => {
        this.setState({ LinkModal: !this.state.LinkModal });
    };
    handleLinkSubmit = item => {
        this.toggleLinkModal();
        if (item.id) {
            this.updateLink(item);
            return;
        }
        this.insertLink(item);
    };
    updateLink = item => {
        axios
        .put(`api/links/${item.id}/`, item)
        .then(res => this.refreshList());
    };
    insertLink = item =>{
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
        this.setState({ activeItem: item, LinkModal: !this.state.LinkModal });
    };
    editLinkItem = item => {
        this.setState({ activeItem: item, LinkModal: !this.state.LinkModal });
    };
    sidebarCollapseClick = () => {
        this.setState({ sidebarActive: !this.state.sidebarActive })
    };      
    drag = item => {
        this.setState({dragItem : item});
    };      
    drop = item => {
        let {dragItem} = this.state;
        dragItem.groupId = item.id;
        this.setState({ dragItem : dragItem});
        this.updateLink(this.state.dragItem);
        this.setState({dragItem : {id:""}});
    };
    render() {
        return (
            <main className={this.state.dragItem ? "drag" : ""}>                
                <div className="wrapper">
                    <nav id="sidebar" className={this.state.sidebarActive ? "active" : ""}>
                        <GroupSideBar
                            setGroup={this.displayGroup}
                            refreshList={this.refreshList}
                            drop={this.drop} />
                        
                        {this.state.dragItem.id !== "" ?<div className="modal-backdrop-dnd"></div> : null}
                    </nav>
                    <div id="content" className={!this.state.contentActive ? " active" : ""}>
                        <ContentNavBar 
                            sidebarCollapseClick={this.sidebarCollapseClick}
                            closePreview={() => { this.setState({ ifraimeUrl: "" }) }}
                            sidebarActive={this.state.sidebarActive}
                            contentActive={this.state.contentActive}
                            activeGroupId={this.state.activeGroupItem.id}/>
                        <div className="link-list">
                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                        </div>
                        {this.state.LinkModal ? (
                            <LinkModal
                                activeItem={this.state.activeItem}
                                groupLinksList={this.state.groupLinksList}
                                toggle={this.toggleLinkModal}
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
                            title="Preview"
                        />
                    ) : null}
                    </div>
                </div>
            </main>
        );
    }
}
export default App;