import {React, useState, useEffect} from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMathJax from "rehype-mathjax";
import useSpeechToText from 'react-hook-speech-to-text'
import { Jutsu, useJitsi } from "react-jutsu/dist";
import webLogo from "./LOGO PNG.png"
import {Layout, Menu, Button, Input , Row, Col, Space, Popover} from 'antd'

import {
  UserOutlined,
  PlusSquareTwoTone,
  SaveTwoTone,
  DeleteOutlined,
  RetweetOutlined,
  AudioTwoTone,
  CalculatorTwoTone,
  VideoCameraTwoTone,
  ExclamationCircleTwoTone,
  CheckCircleTwoTone
} from '@ant-design/icons'

function App() {
  const {
      error,
      interimResult,
      isRecording,
      results,
      startSpeechToText,
      stopSpeechToText,
    } = useSpeechToText({
      continuous: true,
      useLegacyResults: false
    });

  const {Header, Content, Sider} = Layout;

  const [render, setRender] = useState(0);            // this is used to force render, just for efficiency
  const [switchTM, setSwitchTM] = useState(true);     // this used to determine which content show be displayed
  const [curID, setCurID] = useState(-1);             // this is used to denote which note has been selected by ID
  const [ID, setID] = useState(0);                    // this used to get an unique ID to each note
  const [curTitle, setCurTitle] = useState("");       // this used to handle current title
  const [curContent, setCurContent] = useState("");   // this used to handle current content
  const [noteList, setNoteList] = useState([]);       // this is the list to store all notes
                                                      // each note          include following member values:
                                                      //      |-noteID:     unique ID set by ID
                                                      //      |-saved:      boolean value used to denote this note has been saved or not
                                                      //      |-title:      a string used to store the article's title
                                                      //      |-content:    a string used to store the article's content

  // before each time website open/fresh, load all saved notes
  useEffect(() => {
    // load
    console.log("load effect")
    if(localStorage.getItem('state')){
      //console.log("loaded")
      let tempState = JSON.parse(localStorage.getItem('state'));
      console.log(tempState);
      console.log(tempState);
      setSwitchTM(tempState.switchTM);
      setCurID(tempState.curID);
      setID(tempState.ID);
      setNoteList(tempState.noteList);
      console.log("curID", tempState.curID);
      if(tempState.curID != -1){
        
        let curNote = tempState.noteList.filter((item) => {
          return item.noteID === tempState.curID;
        })[0]
        console.log("load content fist", curNote);
        setCurTitle(curNote.title);
        setCurContent(curNote.content);
      }
    }
  }, []) // let this load only run once at the website has be freshed/opened
  

  // this used to select whether show Markdown or Text
  let contentDiv;

  const plugins = [remarkGfm, remarkMath, remarkMath, rehypeKatex, rehypeMathJax];
  //console.log(switchTM)
  if(switchTM){
    contentDiv = <Input.TextArea placeholder="Content..." rows='34' value={curContent} onChange={e => {setCurContent(e.target.value); changeToUnsaved(curID, noteList, setNoteList)}}/>
  }
  else{
    contentDiv = <ReactMarkdown children={curContent} remarkPlugins={plugins}></ReactMarkdown>
  }

  const unSaveIcon = <ExclamationCircleTwoTone twoToneColor="#f5222d"/>
  const savedIcon = <CheckCircleTwoTone twoToneColor="#52c41a" />
  

  const jitsiConfig = {
    roomName: 'MY-MEETING',
    displayName: 'Weitao Sun',
    password: 'password',
    subject: 'fan',
    parentNode: 'jitsi-container',
  };
  const { loading, my_error, jitsi } = useJitsi(jitsiConfig);

  
  const creatMeeting = <div style={{width: "800px", height:"400px"}}>
    {my_error && <p>{my_error}</p>}
    <Jutsu containerStyles={{ width: '800px', height: '400px' }}></Jutsu>
    <div id={jitsiConfig.parentNode} />
  </div>

  //console.log(results);
  if(results.length>0){
    let voiceString = curContent + results.pop().transcript + " ";
    console.log(voiceString);
    setCurContent(voiceString);
  }


  return (
    <Layout className="site-layout-background">
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            //background:'#e6f7ff',
          }}
        >
          <div className="logo" style={{height: '32px', margin: '16px', background:"#112a45"}}>
            <img src={webLogo} alt="" srcset="" style={{height: '32px', margin: '16px', margin:'0', paddingLeft: '52px'}}/>
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={curID === -1? []: [curID.toString()]}>
            {
              noteList.map((item)=>{
                let thisTitle = "New Note"
                if(item.title !== ""){
                  thisTitle = item.title
                }
                return(
                  <Menu.Item key={item.noteID} icon={item.saved ? savedIcon : unSaveIcon} onClick={e => {setCurID(item.noteID); setCurTitle(item.title); setCurContent(item.content);}}>{thisTitle}</Menu.Item>
                )
              })
            }
          </Menu>
        </Sider>
        <Layout  style={{ marginLeft: 200 }}>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%'}}>
            <div>
            <Row>
              <Col span={5}>
                  <Space>
                    <Button type="primary" shape="round" ghost icon={<PlusSquareTwoTone/>} accessKey='c' onClick={e=>{createNote(noteList, setNoteList, curID, setCurID, ID, setID, setCurTitle,setCurContent)}}>New</Button>
                    <Button type="primary" shape="round" ghost icon={<SaveTwoTone/>} accessKey='s' onClick={e=>saveNote(noteList, setNoteList, curID, setCurID, curTitle, curContent, render, setRender, ID, setID, switchTM)}>Save</Button>
                    <Button type="primary" shape="round" danger ghost icon={<DeleteOutlined />} accessKey='r' onClick={e=>{deleteNote(noteList, setNoteList, curID, setCurID)}}>Delete</Button>
                  </Space>
                </Col>
              <Col span={6}></Col>
              <Col span={2}><Button type="primary" shape="circle" icon={<RetweetOutlined />} ghost onClick={e=>{setSwitchTM(!switchTM)}}></Button></Col>
              <Col span={6}></Col>
              <Col span={1}><Button type="primary" shape="circle" icon={<AudioTwoTone twoToneColor={isRecording? "#52c41a" : "undefined"}/>} ghost
                            onClick={isRecording ? stopSpeechToText : startSpeechToText}
                            ></Button></Col>
              <Col span={1}><Button type="primary" shape="circle" icon={<CalculatorTwoTone />} ghost></Button></Col>
              <Col span={1}>
                <Popover placement="bottomRight" title={<p>Start Meeting</p>} content={creatMeeting} trigger="click">
                  <Button type="primary" shape="circle" icon={<VideoCameraTwoTone />} ghost></Button>
                </Popover></Col>
              <Col span={2}></Col>
            </Row>
            </div>
          </Header>
          <Menu className="site-layout-background" mode="horizontal"></Menu>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ padding: 52 , height: "910px"}}>
              <Input placeholder="Please input title" allowClear='True' value={curTitle} onChange={e => {setCurTitle(e.target.value); changeToUnsaved(curID, noteList, setNoteList)}}/>
              <hr/>
              {contentDiv}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;

function createNote(noteList, setNoteList, curID, setCurID, ID, setID, setCurTitle, setCurContent){
  let newNote = {
    noteID: ID,
    saved: false,
    title: "",
    content: ""
  };
  
  setCurID(ID);
  setID(ID + 1)
  setNoteList([...noteList, newNote]);
  setCurContent("");
  setCurTitle("");
  console.log("new node added", curID);
}

function deleteNote(noteList, setNoteList, curID, setCurID){
  console.log("in delete", curID);
  let preID = -1;
  let newCurID = -1;
  let newNoteList = noteList.filter((item)=>{
    
    if(item.noteID === curID){
      newCurID = preID;
    }
    else{
      preID = item.noteID;
    }
    console.log(preID, newCurID);
    return item.noteID !== curID
  });


  setNoteList(newNoteList);

  setCurID(newCurID);
 
  console.log("finish delete", curID);
}

function saveNote(noteList, setNoteList, curID, setCurID, curTitle, curContent, render, setRender, ID, setID, switchTM){
  console.log(curContent, curTitle);

  let newNoteList = noteList;

  if(curID === -1){
    let newNote = {
      noteID: ID,
      saved: true,
      title: curTitle,
      content: curContent
    };

    setCurID(ID);
    setID(ID + 1);
    setNoteList([...noteList, newNote]);
  }
  else{
    newNoteList.forEach((item) => {
      if(item.noteID === curID){
        item.saved = true;
        item.title = curTitle;
        item.content = curContent;
      }
    });
    console.log("saved", newNoteList);
    setNoteList(newNoteList);
  }
  setRender(render+1);

  let saveList = newNoteList.filter((item)=>{
    return !(!item.saved && item.title==="" && item.content==="");
  });
  let finalList = []

  saveList.forEach((item)=>{
    let tempNote = {...item, saved: true};
    finalList.push(tempNote);
  });
  console.log(saveList);
  console.log(finalList);

  let newState = {
    switchTM: switchTM,
    curID: curID,
    ID: ID,
    noteList: finalList
  };
  localStorage.setItem('state', JSON.stringify(newState));
}

function changeToUnsaved(curID, noteList, setNoteList){
  let newNoteList = noteList;
  newNoteList.forEach((item) => {
    if(curID === item.noteID){
      item.saved = false
    }
  });
  setNoteList(newNoteList);
}

//      |-noteID:     unique ID set by ID
//      |-saved:      boolean value used to denote this note has been saved or not
//      |-title:      a string used to store the article's title
//      |-content:    a string used to store the article's content
