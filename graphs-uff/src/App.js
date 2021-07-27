import React, { useState } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import { Graph } from 'react-d3-graph';
import { MdSave } from 'react-icons/md';
import { AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import Input from './TextInput';

export default function ModalProduct() {
  const [nodes, setNodes] = useState([]);
  const [nodeNames, setNodeNames] = useState(['']);
  const [colors, setColors] = useState(['']);
  const [links, setLinks] = useState([]);
  const [nodeSelected, setNodeSelected] = useState(null);
  const [originalColor, setOriginalColor] = useState(null);

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
    },
    link: {
      highlightColor: 'lightblue',
      renderLabel: true,
      labelProperty: 'label',
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
    setNodeNames(arr);
    setColors(arrC);
  };

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

  const onClickLink = function(source, target) {
    setNodeSelected(null);
    const newLink = links.filter(item => item.source !== source);
    setLinks(newLink);

    window.alert(`Link de ${source} com ${target} desfeito`);
  };

  return (
    <Grid container justify="center" alignItems="center">
      Trabalho dos braboes
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
                options={['blue', 'yellow', 'green']}
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
                <Typography>Adicioanr nós</Typography> <AiOutlinePlus />
              </Grid>
            </Grid>
            <Grid>
              <Grid container onClick={handleSave} alignItems="center">
                <Typography>Salvar alterações</Typography> <MdSave />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Graph
            id="graph-id" // id is mandatory
            data={data}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
