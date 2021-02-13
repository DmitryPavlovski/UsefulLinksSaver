import React, { Component } from "react";
import LinkItemCollection from "./components/LinkItemCollection";
import GroupSideBar from "./components/GroupSideBar";
import ContentNavBar from "./components/ContentNavBar";
import { ArrowBarRight, ArrowBarLeft } from 'react-bootstrap-icons';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSidebarActive: false,
            activeGroupId: null,
            ifraimeUrl: "",
            isContentActive: true,
            dropGroupId: "",
            isDraging: false,
            isNeedRefreshLinks: false
        };
    }
    displayGroup = item => {
        this.setState({ activeGroupId: item.id });
    };
    handlePreview = item => {
        this.setState({ ifraimeUrl: item.url });
    }
    sidebarCollapseClick = () => {
        this.setState({ isSidebarActive: !this.state.isSidebarActive })
    };
    setDropItemId = (itemId) => {
        this.setState({ dropGroupId: itemId });
    };
    render() {
        return (
            <main className={this.state.dragItem ? "drag" : ""}>
                <div className="wrapper">
                    <nav id="sidebar" className={this.state.isSidebarActive ? "active" : ""}>
                        <GroupSideBar
                            setGroup={this.displayGroup}
                            drop={this.setDropItemId} />

                        {this.state.isDraging ? <div className="modal-backdrop-dnd"></div> : null}
                    </nav>
                    <div id="content" className={!this.state.isContentActive ? " active" : ""}>
                        <ContentNavBar
                            sidebarCollapseClick={this.sidebarCollapseClick}
                            closePreview={() => { this.setState({ ifraimeUrl: "" }) }}
                            isSidebarActive={this.state.isSidebarActive}
                            isContentActive={this.state.isContentActive}
                            activeGroupId={this.state.activeGroupId}
                            toggleRefreshList={()=>{this.setState({ isNeedRefreshLinks: !this.state.isNeedRefreshLinks})}}
                        />
                        <LinkItemCollection
                            handlePreview={this.handlePreview}
                            isContentActive={this.state.isContentActive}
                            dropGroupId={this.state.dropGroupId}
                            activeGroupId={this.state.activeGroupId}
                            onDragToggle={() => { this.setState({ isDraging: !this.state.isDraging, dropGroupId: "" }) }}
                            isNeedRefreshLinks={this.state.isNeedRefreshLinks}
                        />
                    </div>
                    <div className="link-sidebar" onClick={() => { this.setState({ isContentActive: !this.state.isContentActive }) }}>
                        <div className="hidder">
                            {!this.state.isContentActive ? <ArrowBarRight /> : <ArrowBarLeft />}
                        </div>
                    </div>
                    <div id="iframe" className="iframe-container" style={{ width: '100%' }}>
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