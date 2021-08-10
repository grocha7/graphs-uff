import React, { useState } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import { Graph } from 'react-d3-graph';
import { MdSave } from 'react-icons/md';
import { AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import Input from './components/TextInput';
import Dialog from './components/Dialog';


export default function ModalProduct() {
  const [nodes, setNodes] = useState([]);
  const [nodeNames, setNodeNames] = useState(['']);
  const [colors, setColors] = useState(['']);
  const [links, setLinks] = useState([]);
  const [nodeSelected, setNodeSelected] = useState(null);
  const [originalColor, setOriginalColor] = useState(null);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [source, setSource] = useState(null);
  const [colorLink, setColorLink] = useState(null);
  const [linkLabel, setLinkLabel] = useState(null);
  const [adj, setAdj] = useState([]);
  const [inc, setInc] = useState([]);

  const data = {
    nodes,
    links,
  };

  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: 'lightgreen',
      size: 2000,
      highlightStrokeColor: 'blue',
      fontSize: 12,
      fontWeight: 'bold'
    },
    link: {
      highlightColor: 'lightblue',
      renderLabel: true,
      labelProperty: 'label',
      label: '5',
      fontSize: 12,
      fontWeight: 'bold'
    },
  };

  const handleChangeNodes = (value, index) => {
    console.log(value);
    setNodeNames(nodeNames.map((item, i) => (i !== index ? item : value)));
  };

  const handleChangeColors = (value, index) => {
    const newColors = colors.map(colors => colors);
    newColors.push(value);
    const arr = []
     newColors.forEach((item, i) => {
      return i !== index ? arr.push(item) : arr.push(value)
    });
    setColors(arr);
  };

  const handleAddNodes = () => {
    const arr = nodeNames.map(item => item);
    arr.push('');
    const arrC = colors.map(item => item);
    arrC.push('');
    setNodeNames(arr);
    setColors(arrC);
  };

  const handleAdj = () => {
    let adj = new Array(nodes?.length + 1);
    for(let i=0; i< nodes?.length + 1; i++){
      adj[i] = new Array(nodes?.length + 1);
    }  
    console.log('adj', adj);

        for(let i=0; i < nodes?.length; i++){
          adj[i+1][0] = nodes[i].id;
          adj[0][i+1] = nodes[i].id;
        }
        ///Logica para preencher as adjacencias -> se o elemento adj[i][0] estiver linkado com adj[0][i] colocar 1, caso contrario 0
        //if(((item.source === adj[i][0] && item.source === adj[0][j]) || (item.target === adj[i][0] && item.target === adj[0][j]) ? adj[i][j] === '1' : '0'))
        let adjLength = nodes?.length;
        for (let i = 1; i < adjLength+1; i++) {
          for (let j = 1; j <adjLength+1; j++) {
            console.log('adj[i][0]', adj[i][0], 'i', i);
            console.log('adj[0][j]', adj[0][j], 'j', j);
            links.forEach(item => {
              if((item.source === adj[i][0] && item.target === adj[0][j]) || (item.target === adj[i][0] && item.source === adj[0][j])) return adj[i][j] = '1';
              
              
            }
              )
            
          }
        }
      for (let i = 1; i < adj.length +1; i++) {
        for (let j = 1; j < adj.length + 1; j++) {
         if(adj[i][j] !== '1') return adj[i][j] = '0';
          
        }
        
      }
    console.log('links', links);
    console.log('adj', adj);
    // const arr = [];
    // for (let i = 0; i < j; i++) {
    //   console.log('cheguei no for')
    //   let has = links[i].target === links[j -1].target || links[i].source === links[j -1 ].source ? arr.push('1') : arr.push('0');
    //   nodes.forEach(item => console.log('id', item.id));
    //   console.log('adj', arr)
      
    // }
    
  }

  React.useEffect(() => {
   if(nodes?.length > 0){
    handleAdj();
   }
  }, [links]);



  const handleSave = () => {
    setNodes(
      nodeNames.map((item, index) => ({
        id: item,
        color: colors[index],
      }))
    );
  };

  const handleDelete = index => {
    const newNodeNames = nodeNames.filter((item, i) => index !== i);
    const newcolors = colors.filter((item, i) => index !== i);
    const nodeDeleted = nodeNames.filter((item, i) => index === i);
    console.log(nodeDeleted);
    console.log(links);
    setLinks(links.filter(item => item.source !== nodeDeleted[0] && item.target !== nodeDeleted[0]))
    setNodeNames(newNodeNames);
    setColors(newcolors);
    setNodes(
      newNodeNames.map((item, i) => ({
        id: item,
        color: newcolors[i],
      }))
    );
  };

  const onClickNode = function(nodeId) {
    const nodeX = nodes.filter(item => item.id === nodeId);

    if (nodeSelected) {
      if (nodeSelected.id === nodeId) {
        window.alert(`${nodeId}, retirado da seleção`);
        setNodes(
          nodes.map(item =>
            item.id === nodeId
              ? {
                  id: item.id,
                  color: originalColor,
                }
              : item
          )
        );
        setNodeSelected([]);
        return setOriginalColor(null);
      }
      const newLink = links.map(item => item);

      newLink.push({ source: nodeSelected.id, target: nodeId });
      setLinks(newLink);
      setNodes(
        nodes.map(item =>
          item.id === nodeSelected.id
            ? {
                id: item.id,
                color: originalColor,
              }
            : item
        )
      );
      window.alert(`Link criado de ${nodeId}, com ${nodeSelected.id}`);
      return setNodeSelected(null);
    }
    setNodes(
      nodes.map(item =>
        item.id === nodeId
          ? {
              id: item.id,
              color: 'red',
            }
          : item
      )
    );
    console.log('nodeX', nodeX);
    setOriginalColor(nodeX[0].color);
    setNodeSelected(nodeX[0]);

    window.alert(
      `Nó selecionado ${nodeId}, escolha outro para fazer a ligação`
    );
  };

  const onClickLink = function( source, target) {
    setNodeSelected(null);
    const linkSelected = links.filter(item => item.source === source && item.target === target);
    console.log(linkSelected);
    setColorLink(linkSelected[0].color);
    setLinkLabel(linkSelected[0].label)
    setTarget(target);
    setSource(source);
    console.log(target);
    console.log(source);
    setOpen(true);
 
  };

  const handleChangeColorLink = function(color, label) {
    const linkSelected = links.filter(item => item.source === source && item.target === target);
    linkSelected[0].color = color;
    linkSelected[0].label = label;
    console.log(linkSelected);
    const newLink = links.map(item => item.source !== source && item.target !== target ? item : linkSelected[0]);
    setLinks(newLink);
  }
  
  const handleChangeDeleteLink = () => {
    const arr = []
     const newLink = links.map(item => {
       if(item.source !== source || item.target !== target){
        arr.push(item);
       }
     });
     setLinks(arr);
  }

  return (

            <Grid container justify="center" alignItems="center">
      <Dialog open={open} handleChangeColorLink={handleChangeColorLink} handleChangeDeleteLink={handleChangeDeleteLink} linkLabel={linkLabel} linkColor={colorLink} handleClose={() => {
        setOpen(false);
        setTarget(null)
        setSource(null)
      }}/>
      Trabalho APA 2021.1
      <Grid container justify="center">
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ margin: 40 }}
        >
          {nodeNames.map((item, index) => (
            <Grid container justify="center" alignItems="center">
              <Input
                field="Nó"
                onChange={event => handleChangeNodes(event.target.value, index)}
                width={100}
                marginRight={20}
              />{' '}
              <Input
                field="Cor"
                select
                options={['blue', 'yellow', 'green', 'purple', 'black', 'grey', 'pink']}
                onChange={event =>
                  handleChangeColors(event.target.value, index)
                }
                width={100}
                marginRight={20}
              />
              <IconButton onClick={() => handleDelete(index)}>
                <AiFillDelete />
              </IconButton>
            </Grid>
          ))}
          <Grid container justify="center" style={{ marginTop: 40 }}>
            <Grid>
              <Grid
                container
                onClick={handleAddNodes}
                alignItems="center"
                style={{ marginRight: 20 }}
              >
                <Typography>Adicionar novo nó</Typography> <AiOutlinePlus />
              </Grid>
            </Grid>
            <Grid>
              <Grid container onClick={handleSave} alignItems="center">
                <Typography>Salvar alterações</Typography> <MdSave />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid container justify='center'>
          <Grid>

          </Grid>
          <Grid>
            <Typography>Matriz de incidência</Typography>
          </Grid>
        </Grid> */}
        <Grid container justify="center" style={{border: '1px solid #000000', width: 800, marginBottom: 10}}>
          <Graph
            id="graph-id" // id is mandatory
            data={data}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        </Grid>
      </Grid>
      <Grid container alignItems='flex-end' justify='center'>
        <Typography>Trabalho realizado por Eriky Nunes e Gian Rocha</Typography>
      </Grid>
    </Grid>    
  );
}
