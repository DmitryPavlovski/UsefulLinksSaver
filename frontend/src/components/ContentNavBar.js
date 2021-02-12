import React, { Component } from "react";
import LinkModal from "./LinkModal";
import { Window } from "react-bootstrap-icons";
import axios from "axios";

export default class ContentNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addLinkModal:false,
            item:{
                title: "",
                description: "",
                url: "",
                groupId: ""
            }
        };
    };
    handleLinkSubmit = () => {
        this.toggleAddLinkModal();
        this.insertLink(this.state.item);
    };
    insertLink = item =>{
        axios
        .post("api/links/", item)
        .then(res => this.refreshList());
    };
    toggleAddLinkModal = () => {
        this.setState({ addLinkModal: !this.state.addLinkModal });
    };
    createLinkItem = () => {
        const item = {...this.state.item, groupId: this.props.activeGroupId };
        this.setState({item})
        this.toggleAddLinkModal();
    }
    render() {
        return (
            <div className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container px-0">
                    <div className="row row-button">
                        <div className={`col-3 ${this.props.contentActive ? "" : "d-none"}`}>
                            <button type="button" id="sidebarCollapse" className={`navbar-btn pl-0 ${this.props.sidebarActive ? " active" : ""}`} onClick={this.props.sidebarCollapseClick}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                        <div className={`add-button-container ${this.props.contentActive ? "col-7" : "col-9 px-0 pl-4"}`}>
                            <button onClick={this.createLinkItem} className="navbar-btn btn btn-primary add-button">
                                Add link
                            </button>
                        </div>
                        <div className={`float-sm-right ${this.props.contentActive ? "col-2" : "col-3 px-0"}`}>
                            <button className="navbar-btn btn" onClick={this.props.closePreview}>
                                <Window />
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.addLinkModal ? (
                    <LinkModal
                        activeItem={this.state.item}
                        toggle={this.toggleAddLinkModal}
                        onSave={this.handleLinkSubmit}
                    />
                ) : null}
            </div>
        );
    }
}