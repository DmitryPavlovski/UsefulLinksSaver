import React, { Component } from "react";
import AddGroupModal from "./AddGroupModal";
import axios from "axios";
import { PlusCircle, PencilSquare, X } from 'react-bootstrap-icons';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default class GroupSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: {
                title: "",
                id: null
            },
            groupList: []
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
        this.props.refreshList();
    };
    displayGroup = item => {
        this.setState({ activeItem: item });
        const { setGroup } = this.props;
        return setGroup(item);
    };
    renderTabList = () => {

        return (
            <div>                
                {this.state.groupList.map(item => (
                    <li key={item.id.toString()} className={this.state.activeItem.id === item.id ? " active" : ""}>
                        <a key={item.id.toString()} href="/#" onClick={() => this.displayGroup(item)}>
                            {item.title}{" "}
                            {this.state.activeItem.id === item.id ? (
                                <div className="d-inline float-sm-right">
                                    <PencilSquare onClick={() => this.editGroupItem(item)} className="mr-3"/>
                                    <X onClick={() => this.handleGroupDelete(item)} />
                                </div>
                            ) : null}
                        </a>
                    </li>
                ))}
                <li className={this.state.activeItem.id === null ? "active" : ""}>
                    <a href="/#" onClick={() => this.displayGroup({ title: "", id: null })}>
                        Unsorted
                    </a>
                </li>                
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
                    <h1 className="text-uppercase mt-4 mb-3">Links app</h1>
                </div>
                <div className="editor">
                    <button className="btn btn-inverse" onClick={this.createGroupItem}>
                        <PlusCircle />
                    </button>
                </div>
                <div className="">
                    <ul className="components px-0">
                        {this.renderTabList()}
                    </ul>
                </div>
                {this.state.addGroupModal ? (
                    <AddGroupModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggleAddGroupModal}
                        onSave={this.handleGroupSubmit}
                    />
                ) : null}
            </div>
        );
    }
}