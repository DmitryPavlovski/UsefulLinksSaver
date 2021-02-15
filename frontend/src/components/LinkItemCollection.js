import React, { Component } from "react";
import LinkModal from "./LinkModal";
import { Trash, Pencil } from 'react-bootstrap-icons';
import axios from "axios";
import "../css/LinkItemCollection.css"

export default class LinkItemCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLinkModal: false,
            linkList: [],
            activeItem: { id: null },
            dragItem: { id: "" }
        };
    };

    componentDidMount() {
        this.refreshList();
    };
    componentDidUpdate(prevProps) {
        if (prevProps.dropGroupId !== this.props.dropGroupId) {
            this.drop();
        }
        if (prevProps.isNeedRefreshLinks !== this.props.isNeedRefreshLinks){
            this.refreshList();
        }
    };
    refreshList = () => {
        axios
            .get("api/links/")
            .then(res => this.setState({ linkList: res.data.sort(item => { return new Date() - new Date(item.createdOn) }) }))
            .catch(err => console.log(err));
    };

    toggleLinkModal = () => {
        this.setState({ isLinkModal: !this.state.isLinkModal });
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
    insertLink = item => {
        axios
            .post("api/links/", item)
            .then(() => this.refreshList());
    };
    handleLinkDelete = item => {
        axios
            .delete(`api/links/${item.id}`)
            .then(() => this.refreshList());
    };
    dragEnd = () => {
        this.setState({ dragItem: { id: "" } });
        this.props.onDragToggle();
    };
    drag = item => {
        this.setState({ dragItem: item });
        this.props.onDragToggle();
    };
    drop = () => {
        const dragItem = { ...this.state.dragItem, groupId: this.props.dropGroupId };
        if(this.state.dragItem.id !== ""){            
            this.updateLink(dragItem);
            this.setState({ dragItem: { id: "" } });
        }
    };
    editLinkItem = item => {
        this.setState({ activeItem: item, isLinkModal: !this.state.isLinkModal });
    };
    handlePreview = item => {
        this.setState({ activeItem: item })
        this.props.handlePreview(item);
    }

    renderItems = () => {
        return this.state.linkList.filter(item => item.groupId === this.props.activeGroupId)
            .map(item => (
                <li draggable={true}
                    onDragStart={() => { this.drag(item) }}
                    onDragEnd={this.dragEnd}
                    key={item.id}
                    onClick={() => this.handlePreview(item)}
                    className={`list-group-item ${this.state.activeItem.id === item.id ? "active" : ""} ${this.state.dragItem.id === item.id ? "draging" : ""}`}>
                    <div className="mx-0 p-1">
                        <div className="card-body p-1" title={item.description}>
                            <h5 className="card-title mb-0 mx-0">{item.title}</h5>
                            <div className="mx-0">
                                <a className="card-subtitle mb-0 mt-0 text-muted mx-0 text-truncate d-block display-8" key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                            </div>
                            {this.props.isContentActive ?
                                <div className="row-xs mx-0">
                                    <button
                                        onClick={() => this.editLinkItem(item)}
                                        className="btn btn-secondary ml-1 card-link py-0 px-1"
                                    >
                                        <Pencil />
                                    </button>
                                    <button
                                        onClick={() => this.handleLinkDelete(item)}
                                        className="btn btn-danger ml-1 card-link py-0 px-1 float-sm-right"
                                    >
                                        <Trash />
                                    </button>
                                </div> : null}
                        </div>
                    </div>
                </li>
            ));
    };

    render() {
        return (
            <div>
                <div className="link-list">
                    <ul className="list-group list-group-flush">
                        {this.renderItems()}
                    </ul>
                </div>
                {this.state.isLinkModal ? (
                    <LinkModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggleLinkModal}
                        onSave={this.handleLinkSubmit}
                    />
                ) : null}
            </div>
        );
    }
}