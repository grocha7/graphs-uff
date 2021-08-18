import React, { useState } from 'react';
import { Grid, IconButton, Typography, Switch } from '@material-ui/core';
import { Graph } from 'react-d3-graph';
import { MdSave } from 'react-icons/md';
import { AiFillDelete, AiOutlinePlus, AiFillFastBackward, AiFillFastForward, AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
import Input from './components/TextInput';
import Dialog from './components/Dialog';

const graphEX = [{id: 'NQ', color: "blue"}, {id: "MT", color: 'yellow'}, {id: "UN", color: 'green'}, {id: "PM", color: 'purple'}, {id: "UB", color: 'black'}, {id: "BH", color: 'grey'}, {id: "JF", color: 'pink'}]
const linksEX = [{source: 'UB', target: 'PM', label: 280}, {source: 'PM', target: 'UN', label: 200}, {source: 'PM', target: 'BH', label: 400}, {source: 'UN', target: 'BH', label: 650}, {source: 'JF', target: 'BH', label: 300}, {source: 'BH', target: 'MT', label: 350}, {source: 'MT', target: 'NQ', label: 250}, {source: 'BH', target: 'NQ', label: 600},]


export default function ModalProduct() {
  const [nodes, setNodes] = useState(graphEX);
  const [nodeNames, setNodeNames] = useState(['']);
  const [colors, setColors] = useState(['']);
  const [links, setLinks] = useState(linksEX);
  const [nodeSelected, setNodeSelected] = useState(null);
  const [originalColor, setOriginalColor] = useState(null);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [source, setSource] = useState(null);
  const [colorLink, setColorLink] = useState(null);
  const [linkLabel, setLinkLabel] = useState(null);
  const [adj, setAdj] = useState([]);
  const [incid, setIncid] = useState([]);
  const [linksKruskal, setLinksKruskal] = useState([]);
  const [plus, setPlus] = useState(false);
  const [kruskalAux, setKruskalAux] = useState([]);
  const [popKruskal, setPopKruskal] = useState([]);
  const [minus, setMinus] = useState([]);
  const [isKruskal, setIsKruskal] = useState(false);
  const [linksPrim, setLinksPrim] = useState([]);
  const [nodePrim, setNodePrim] = useState(null);
  const [plusPrim, setPlusPrim] = useState(false);
  const [minusPrim, setMinusPrim] = useState(false);
  const [primAux, setPrimAux] = useState([]);
  const [routesPrim, setRoutesPrim] = useState([]);
  const [countPrim, setCountPrim] = useState(0);

  const data = {
    nodes,
    links,
  };

  const kruskal = {
    nodes: graphEX,
    links: linksKruskal,
  }

  const prim = {
    nodes: graphEX,
    links: linksPrim,
  }

  const myConfig2 = {
    automaticRearrangeAfterDropNode: false,
    d3:{
      alphaTarget: 0.1,
      disableLinkForce: true,
      gravity: -400,
      linkLength: 200,
    },
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
      fontSize: 14,
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
    //Adicionando o cabeçalho da matriz
    for(let i=0; i < nodes?.length; i++){
      adj[i+1][0] = nodes[i].id;
      adj[0][i+1] = nodes[i].id;
    }
    ///Logica para preencher as adjacencias -> se o elemento adj[i][0] estiver linkado com adj[0][i] colocar 1, caso contrario 0
    let adjLength = nodes?.length;
    for (let i = 1; i < adjLength+1; i++) {
      for (let j = 1; j <adjLength+1; j++) {            
        links.forEach(item => {
          if((item.source === adj[i][0] && item.target === adj[0][j]) || (item.target === adj[i][0] && item.source === adj[0][j])) return adj[i][j] = '1';              
        })            
      }
    }
    //Logica para preencher os elementos vazios ou que não tenha adjacencia
    adj[0][0] = ' ';
    for (let i = 1; i < adjLength+1; i++) {
      for (let j = 1; j <adjLength+1; j++) {
        if(adj[i][j] != '1'){
          adj[i][j] = '0'
        }
      }
    }    
    setAdj(adj);
  }

  const handleInc = () => {
    //Inicializando a matriz
    let inc = new Array(links?.length+1);
    for(let i=0; i< nodes?.length + 1; i++){
      inc[i] = new Array(links?.length + 1);
    }
    //Adicionando o cabeçalho da matriz
    for(let i=0; i < nodes?.length; i++){
      inc[i+1][0] = nodes[i].id;
    }
    for(let i=0; i < links?.length; i++){
      inc[0][i+1] = links[i].target + '-' +links[i].source;
    }
    //Logica para preencher as incidencias -> se o elemento inc[i][0] for um elemento do link[0][i] colocar 1, caso contrario 0;
    let nodesLength = nodes?.length;
    let linksLength = links?.length;
    for (let i = 1; i < nodesLength+1; i++) {
      let controlador = 1;
      for (let j = 1; j <linksLength+1; j++) {       
        
        links.forEach(item => {
          
          if(item.source == inc[i][0] || item.target == inc[i][0]) return inc[i][controlador] = '1';      
          controlador++;        
        })            
      }
      
    }
    //Logica para preencher os elementos vazios ou que não tenha adjacencia
    inc[0][0] = ' ';
    // for (let i = 1; i < linksLength+1; i++) {
    //   for (let j = 1; j <nodesLength+1; j++) {
    //     if(inc[i][j] != '1'){
    //       inc[i][j] = '0'
    //     }
    //   }
    // }    
    console.log('links', links);
    console.log('inc', inc);
    setIncid(inc);
  }

  React.useEffect(() => {
   if(nodes?.length > 0){
    handleAdj();
    handleInc();
   }
  }, [links, nodes]);

  

  
  const handleLinksKruskal = () => {
    let arr = [];
    links.forEach((item, i) => {
        let soma = [];
        console.log('-------------/----------');
        let arrTarget = arr.forEach((filt, index) => {
          if (index !== i && filt.target === item.target){
            console.log('pushei 1', filt, item);
             soma.push(filt.source)
          } if(filt.source === item.target){
            console.log('pushei 2', filt, item)
             soma.push(filt.target);
          } 
        })
      let arrSource = arr.forEach((filt, index) => {
        if(index !== i && filt.source === item.source) {            console.log('pushei 3', filt, item);
         soma.push(filt.target)};
        if(filt.target === item.source) { console.log('pushei 4', filt, item); soma.push(filt.source)};
      });
      console.log('estou no passo', i);
      console.log('item', item);
      console.log('linksKruskal', arr);
      console.log('soma', soma);
      soma.sort();
      console.log('somaSort', soma);
      let validation = true;
      for (let index = 1; index < soma.length; index++) {
        if(soma[index] === soma[index - 1]){
          console.log('entrei aqui', soma[index]);
          return validation = false; 
          
      } 
      }
        // for (let index = 0; index < soma.length - 2; index++) {
        //   for (let j = 1; j < soma.length && j !== index; index++) {
        //      if(soma[index] === soma[j]){
        //         console.log('entrei aqui', soma[index], soma[j]);
        //         return validation = false; 
               
              
        //     } 
        //   }
        // }

      console.log('validation', validation);
      if(validation) { // condição para criar o link
        arr.push({target: item.target, source: item.source, label: item.label})
        setKruskalAux(arr);
      } 
     
    })
  }

  const handleLinksPrim = () => {
    let arr = nodePrim.map(item => item);
    console.log('arr', arr);
    console.log('primAux', primAux);
    const filter = primAux.filter(item => arr.includes(item.target) || arr.includes(item.source));
    setPrimAux(primAux.filter((item) => item !== filter[0]));
    setRoutesPrim(filter);
    setLinksPrim([...linksPrim, filter[0]]);
    const newNode = arr.includes(filter[0].target) ? filter[0].source : filter[0].target
    setCountPrim(countPrim + 1);
    console.log('newNode', newNode);
    console.log('filter', filter);
    arr.push(newNode);
    setNodePrim(arr);
  }

  

  const handleSortLinks = () => {
    const linkSorted = links.sort(function (a, b) {
       if (a.label > b.label) {
         return 1;
       }
       if (a.label < b.label) {
         return -1;
       }
       // a must be equal to b
       return 0;
     });
     handleLinksKruskal();
   }

  React.useEffect(() => {
    if(links.length > 0){
     handleSortLinks();
     setPrimAux(links)
    }
  }, [links])

 

  React.useEffect(() => {
    if (plus && kruskalAux.length > 0){
      setLinksKruskal([...linksKruskal, kruskalAux[0]]);
      const aux = kruskalAux.filter((item, index) => index !== 0)
      setKruskalAux(aux);
      setPlus(false);
    }
  }, [plus])

  const handleFinishKruskal =  () => {
    setLinksKruskal([...linksKruskal, ...kruskalAux]);
    setKruskalAux([]);
  }

  const handleInitKruskal = () => {
    setLinksKruskal([]);
    setKruskalAux([...linksKruskal, ...kruskalAux]);
  }

  React.useEffect(() => {
    if (minus && linksKruskal.length > 0){
      setKruskalAux([ linksKruskal[linksKruskal.length - 1], ...kruskalAux]);
      setLinksKruskal(linksKruskal.filter((item, index) => index !== linksKruskal.length - 1));
      setMinus(false);
    }
  }, [minus])

  React.useEffect(() => {
    if (plusPrim && kruskalAux.length > 0){
      setLinksKruskal([...linksKruskal, kruskalAux[0]]);
      const aux = kruskalAux.filter((item, index) => index !== 0)
      setKruskalAux(aux);
      setPlusPrim(false);
    }
  }, [plusPrim])

  const handleFinishPrim =  () => {
    setLinksKruskal([...linksKruskal, ...kruskalAux]);
    setKruskalAux([]);
  }

  const handleInitPrim = () => {
    setLinksKruskal([]);
    setKruskalAux([...linksKruskal, ...kruskalAux]);
  }

  React.useEffect(() => {
    if (minusPrim && linksKruskal.length > 0){
      setKruskalAux([ linksKruskal[linksKruskal.length - 1], ...kruskalAux]);
      setLinksKruskal(linksKruskal.filter((item, index) => index !== linksKruskal.length - 1));
      setMinusPrim(false);
    }
  }, [minusPrim])

  



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

  const handleSelectNodePrim = (nodeId) => {
    if(linksPrim.length > 0) return;
    const nodeX = nodes.filter(item => item.id === nodeId);
    setNodePrim([nodeX[0].id])
  }

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
          justify="space-between"
          style={{ margin: 40 }}
        >
          
          <Grid>
          {/* {nodeNames.map((item, index) => (
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
          ))} */}
          {/* <Grid container justify="center" style={{ marginTop: 40 }}>
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
          </Grid> */}
          </Grid>
          {/* <Grid>
            <Typography style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}} align='center'>Matriz de incidência</Typography>
            <Grid>
            {incid.map((item, i) => (
              <Grid container>
                {item.map((value, j )=> (
                  <Typography align='center' style={{padding: 5, width: 50, fontWeight: (i === 0 || j === 0) && 'bold' }}>{value}</Typography>
                ))}
              </Grid>
            ))}
            </Grid>
          </Grid> */}
        </Grid>
        {/* <Grid container justify='center' style={{margin: '100px 0px'}}> */}
          {/* <Grid>

          </Grid>
          <Grid>
            <Typography>Matriz de incidência</Typography>
          </Grid> */}
        {/* </Grid> */}
        <Grid component="label" container alignItems="center" justify='center' spacing={1}>
          <Grid item>Prim</Grid>
          <Grid item>
            <Switch checked={isKruskal} onChange={() => setIsKruskal(!isKruskal)} name="checkedC" />
          </Grid>
          <Grid item>Kruskal</Grid>
        </Grid>
        <Grid container spacing={1} justify="center" >
         <Grid style={{border: '1px solid #000000', marginBottom: 10, marginRight: 100, padding: 1}}>
           <Typography align='center'>Grafo original</Typography>
         <Graph
            id="graph-id" // id is mandatory
            data={data}
            config={myConfig2}
            // onClickNode={onClickNode}
            // onClickLink={onClickLink}
          />
         </Grid>
        <Grid style={{border: '1px solid #000000', marginBottom: 10, padding: 1}}>
        {isKruskal ? (
          <>
            <Typography align='center'>Grafo Kruskal</Typography>
          <Graph
            id="xdzao" // id is mandatory
            data={kruskal}
            config={myConfig2}
            // onClickNode={onClickNode}
            // onClickLink={onClickLink}
          />
          </>
        ) : (
          <>
          <Typography align='center'>Grafo Prim | {nodePrim && `Nó inicial - ${nodePrim[0]}`}</Typography>
        <Graph
          id="xdzada" // id is mandatory
          data={prim}
          config={myConfig2}
          onClickNode={handleSelectNodePrim}
          // onClickLink={onClickLink}
        />
        </>
        )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container alignItems='center' justify='center'>
        <Grid style={{width: 100}}>

        
     {isKruskal ? !(linksKruskal.length === 0 && kruskalAux.length > 0) && (
        <Grid container>
          <IconButton onClick={() => handleInitKruskal()}><AiFillFastBackward/></IconButton>
          <IconButton onClick={() => setMinus(true)}><AiFillCaretLeft/></IconButton>
        </Grid>
     ) : (
      <Grid container>
      <IconButton ><AiFillFastBackward/></IconButton>
      <IconButton onClick={() => setMinusPrim(true)}><AiFillCaretLeft/></IconButton>
    </Grid>
     )}
     </Grid>
     <Grid style={{margin: '0px 20px'}}>
     <Typography style={{fontWeight: 'bold', fontSize: 20}} align='center' >Algoritmo de {isKruskal ? 'Kruskal' : 'Prim'} </Typography>
     <Typography align='center' style={{fontSize: 12}}>Desenvolvido por Eriky e Gian</Typography>
     </Grid>
        
        <Grid style={{width: 100}}>

        {isKruskal ? !(kruskalAux.length === 0 && linksKruskal.length > 0)  && (
          <Grid container>
             <IconButton onClick={() => setPlus(true)}><AiFillCaretRight/></IconButton>
             <IconButton onClick={() => handleFinishKruskal()}><AiFillFastForward/></IconButton>
          </Grid>
        ) : (
          <Grid container>
             <IconButton onClick={() => handleLinksPrim(true)}><AiFillCaretRight/></IconButton>
             <IconButton onClick={() => handleFinishKruskal()}><AiFillFastForward/></IconButton>
          </Grid>
        )
        }

        </Grid>
      </Grid>
      {!isKruskal && nodePrim && (
        <Grid style={{marginTop: 30}}>
          <Typography align='center' style={{fontSize: 20}}>Possiveis caminhos</Typography>
          <Grid container>
           
          </Grid>
          {routesPrim.map((item, index) => (
            <Typography align='center' style={{fontWeight: index === 0 && 'bold', margin: 8}}>{item.target} ->  {item.source} | {item.label}</Typography>
          ))}

        </Grid>
      )}
      {/* <Grid>
             <Typography style={{fontWeight: 'bold', fontSize: 14, marginTop: 30}} align='center'>Matriz de adjacência</Typography>
            <Grid>
            {adj.map((item, i) => (
              <Grid container>
                {item.map((value, j )=> (
                  <Typography align='center' style={{padding: 3, width: 30, fontWeight: (i === 0 || j === 0) && 'bold', fontSize: 14 }}>{value}</Typography>
                ))}
              </Grid>
            ))}
            </Grid> 
          </Grid> */}
          {/* <Grid>
            <Typography style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}} align='center'>Matriz de incidência</Typography>
            <Grid>
            {incid.map((item, i) => (
              <Grid container>
                {item.map((value, j )=> (
                  <Typography align='center' style={{padding: 5, width: 50, fontWeight: (i === 0 || j === 0) && 'bold' }}>{value}</Typography>
                ))}
              </Grid>
            ))}
            </Grid>
          </Grid> */}
    </Grid>    
  );
}
