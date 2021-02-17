import React, { Component } from "react";
import GroupModal from "./GroupModal";
import axios from "axios";
import { PlusCircle, PencilSquare, X } from 'react-bootstrap-icons';
import '../css/GroupSideBar.css';

export default class GroupSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: {
                title: "",
                id: null
            },
            groupList: [],
            dragOverItemId: ""
        };
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList = () => {
        axios
            .get("api/groups_links/")
            .then(res => this.setState({ groupList: res.data }))
            .catch(err => console.log(err));
    };
    displayGroup = item => {
        this.setState({ activeItem: item });
        this.props.setGroup(item);
    };
    drop = item => {
        this.props.drop(item.id);
        this.setState({ dragOverItemId: "" });
    };
    onDragOver = (item, event) => {
        event.preventDefault()
        this.setState({ dragOverItemId: item.id });
    };
    renderTabList = () => {
        return (
            <div className="group-list">
                {this.state.groupList.map(item => (
                    <div key={item.id.toString()}
                        onDrop={() => { this.drop(item) }}
                        onDragOver={(event) => { this.onDragOver(item, event) }}
                        className={this.state.dragOverItemId === item.id ? "dragOver" : ""}>
                        <li className={this.state.activeItem.id === item.id ? " active" : ""}>
                            <a key={item.id.toString()} href="/#" onClick={() => this.displayGroup(item)}>
                                {item.title}{" "}
                                {this.state.activeItem.id === item.id ? (
                                    <div className="d-inline float-sm-right">
                                        <PencilSquare onClick={() => this.editGroupItem(item)} className="mr-3" />
                                        <X onClick={() => this.handleGroupDelete(item)} />
                                    </div>
                                ) : null}
                            </a>
                        </li>
                    </div>
                ))}
                <div onDrop={() => { this.drop({ id: null }) }}
                    onDragOver={(event) => { this.onDragOver({ id: null }, event) }}
                    className={this.state.dragOverItemId === null ? "dragOver" : ""}>
                    <li className={this.state.activeItem.id === null ? "active" : ""}>
                        <a href="/#" onClick={() => this.displayGroup({ title: "", id: null })}>
                            Unsorted
                        </a>
                    </li>
                </div>
            </div>
        );
    };
    toggleAddGroupModal = () => {
        this.setState({ addGroupModal: !this.state.addGroupModal });
    };
    handleGroupSubmit = item => {
        this.toggleAddGroupModal();
        if (item.id) {
            axios
                .put(`api/groups_links/${item.id}/`, item)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("api/groups_links/", item)
            .then(res => this.refreshList());
    };
    handleGroupDelete = item => {
        axios
            .delete(`api/groups_links/${item.id}`)
            .then(res => this.refreshList());
    };
    createGroupItem = () => {
        const item = { title: "" };
        this.setState({ activeItem: item, addGroupModal: !this.state.addGroupModal });
    };
    editGroupItem = item => {
        this.setState({ activeItem: item, addGroupModal: !this.state.addGroupModal });
    };
    render() {
        return (
            <div>
                <div className="sidebar-heading">
                    <h1 className="mt-2 mb-3">Useful Links Saver</h1>
                </div>
                <div className="editor">
                    <button className="btn btn-inverse" onClick={this.createGroupItem}>
                        <PlusCircle />
                    </button>
                </div>
                <div className="group-box tabs-scroller">
                    <ul className="components px-0">
                        {this.renderTabList()}
                    </ul>
                </div>
                {this.state.addGroupModal ? (
                    <GroupModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggleAddGroupModal}
                        onSave={this.handleGroupSubmit}
                    />
                ) : null}
            </div>
        );
    }
}