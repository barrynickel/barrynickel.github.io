import React, { useState, useEffect, useRef } from "react";
import parse from "html-react-parser"

import { type AllWidgetProps, jsx, getAppStore, appActions, MutableStoreManager, ReactRedux, type WidgetProps, WidgetManager, type IMState, WidgetState } from 'jimu-core'
const { useSelector, useDispatch } = ReactRedux
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { 
    Container, 
    Row, 
    Button, 
    Label, 
    Loading, 
    CollapsablePanel, 
    CollapsableCheckbox, 
    CollapsableRadio, 
    Tooltip, 
    Radio 
} from "jimu-ui";

import { LayerOutlined } from 'jimu-icons/outlined/gis/layer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFolderOpen, faCircleDown } from '@fortawesome/free-regular-svg-icons'
import { faArrowRotateLeft, faBars, faEye } from '@fortawesome/free-solid-svg-icons'

import esriRequest from "esri/request"
import symbolUtils from "esri/symbols/support/symbolUtils";
import rendererJsonUtils from "esri/renderers/support/jsonUtils";
import rendererUtils from "esri/renderers/support/utils";
import sizeSchemes from "esri/smartMapping/symbology/size";
import Color from "@arcgis/core/Color.js";
import Point from "esri/geometry/Point"
import Legend from "esri/widgets/Legend"
import reactiveUtils from "esri/core/reactiveUtils"

import { type IMConfig } from '../config'
import './lib/style.css'

const InputCollapse = ({
    layer,
    componentType,
    layerVisibility,
    onInputCheckedChange,
    view,
    mapServices,
    mapScale,
    legendData,
    layerLoading
}: any) => {
    const [visible, setVisible] = useState(layer.layer.visible);
    const [legend, setLegend] = useState(null);
    const [legendWidget, setLegendWidget] = useState(null);
    const [legendWidgetStatic, setLegendWidgetStatic] = useState(null);
    const [showMapDisplay, setShowMapDisplay] = useState("")
    const [panelOpen,setPanelOpen] = useState(false)
    const legendRef = useRef(null);
    
    useEffect(() => {
        if (view && panelOpen) {
            if (!legendWidget && ((layer.config && layer.config.legendwidget) || !legend) {
                let parent = null
                if (layer.parent) {
                    parent = view.map.allLayers.items.find((l) => { 
                        return l.id == layer.parent
                    })
                }
                
                let layerInfo = {
                    title:"",
                    layer: parent ? parent : layer.layer,
                    sublayerIds: parent ? [layer.serviceId] : null
                }

                const lgw = new Legend({
                    view: view,
                    container: legendRef.current,
                    layerInfos:[layerInfo],
                    respectLayerVisibility: false
                });
                
                reactiveUtils.when(
                    () => lgw.activeLayerInfos.length > 0, 
                    (al) => {
                        window.setTimeout(() => {
                            if (lgw.container && lgw.container.children.length > 0) {
                                setLegendWidgetStatic(lgw.container)
                            }
                        }, 2000)
                    }
                );
                setLegendWidget(lgw)
            }
        }
  }, [panelOpen, view]);
    
    useEffect(() => {
        if (legendData) {
            setLegend(legendData[layer.uid])
        }
    },[legendData])
    
    useEffect(() => {
        if (legendRef.current && legendWidgetStatic) {
            legendWidgetStatic.setAttribute("id",`${legendWidgetStatic.id}-static`)
            legendRef.current.parentNode.replaceChild(legendWidgetStatic, legendRef.current)
        }
    },[legendWidgetStatic, legendRef.current])
    
    useEffect(() => {
        let checked = layerVisibility[layer.group].includes(layer.uid)
        setVisible(checked)
    },[layerVisibility])
    
    useEffect(() => {
        if (mapScale) {
            let disable = false
            if (layer.layer.minScale > 0) {
                if (mapScale > layer.layer.minScale) {
                    disable = true
                }
            }
            if (layer.layer.maxScale > 0) {
                if (mapScale < layer.layer.maxScale) {
                    disable = true
                }
            }
            let mapDisplay = disable ? "no-map-display" : ""
            setShowMapDisplay(mapDisplay)
        }
    },[mapScale])
    
    const InputLabel = () => {
        return (
            <div className="d-flex w-100">
                <div style={{ flexGrow:"1" }}>
                    <Tooltip 
                        placement="right"
                        title={layer.layer.sourceJSON && layer.layer.sourceJSON.description ? layer.layer.sourceJSON.description : "No description available."}
                        showArrow
                    >
                        <div style={{display: "inline-block", paddingRight:"10px", position:"relative", top:"1px", fontSize:"14px", lineHeight:"16px"}}>{layer.title}</div>
                    </Tooltip>
                </div>
                <div style={{ position:"relative", width:"20px"}}>
                    {layerLoading == layer.uid &&
                        <Loading
                            type="SECONDARY"
                            width={12}
                            height={6}
                        />
                    }
                </div>
            </div>
        )
    }
    
    return (
        <div className={`collapsable-${componentType} ${showMapDisplay}`}>
            {
                (componentType == "radio") ? (
                    <CollapsableRadio 
                        id={layer.uid}
                        name='results-radio' 
                        label={ <InputLabel layer={layer} /> }
                        type="default" 
                        checked={visible}
                        onCheckedChange={(checked) =>   { 
                            onInputCheckedChange(checked, layer, componentType)
                            
                        }
                        onRequestOpen={() => {
                            setPanelOpen(true)
                        }}
                        onRequestClose={() => {
                            setPanelOpen(false)
                        }}
                    >
                        <div
                            id={layer.uid+"-legend"}
                            style={{ padding:"5px 0px 10px 27px" }}
                        >
                            {((layer.config && layer.config.legendwidget) || !legend) ? 
                                (<div id={layer.uid+"-legend-container"} ref={legendRef}></div>)
                                :
                                (<>{legend}</>)
                            }
                        </div>
                    </CollapsableRadio>
                ) : (
                    <CollapsableCheckbox 
                        id={layer.uid}
                        label={ <InputLabel layer={layer} /> } 
                        type="default"
                        checked={visible}
                        onCheckedChange={(checked) => {
                            onInputCheckedChange(checked, layer, componentType)
                        }
                        onRequestOpen={() => {
                            setPanelOpen(true)
                        }}
                        onRequestClose={() => {
                            setPanelOpen(false)
                        }}
                    >
                        <div
                            id={layer.uid+"-legend"}
                            style={{ padding:"5px 0px 10px 27px" }}
                        >
                            {((layer.config && layer.config.legendwidget) || !legend) ? 
                                (<div id={layer.uid+"-legend-container"} ref={legendRef}></div>)
                                :
                                (<>{legend}</>)
                            }
                        </div>
                    </CollapsableCheckbox>
                )
            }
         </div>
    )
}

const TreeComponentRecursive = ({ 
    data,
    componentType,
    layerVisibility,
    onInputCheckedChange,
    view,
    mapServices,
    mapScale,
    legendData,
    layerLoading,
    isSubLayerVisibleRecursive
}: any) => {
    const [expanded, setExpanded] = useState(false);
    const [subLayersVisible, setSubLayersVisible] = useState(false);
    
    useEffect(() => {
        setSubLayersVisible(isSubLayerVisibleRecursive(data))
    },[])
    
    useEffect(() => {
        setSubLayersVisible(isSubLayerVisibleRecursive(data))
    },[layerVisibility])

    if (data.node && data.layers == null) {
        return (
            <div class="node">
                <InputCollapse
                    layer={data}
                    componentType={componentType}
                    layerVisibility={layerVisibility}
                    onInputCheckedChange={onInputCheckedChange}
                    view={view}
                    mapServices={mapServices}
                    mapScale={mapScale}
                    legendData={legendData}
                    layerLoading={layerLoading}
                />
            </div>
        )
    }
    return (
        (data.node) ? (
            <div class="folder">
                <Container className="m-1 p-0">
                    <Row 
                        style={{ "cursor": "pointer"}}
                        className="m-0 p-0 align-items-center pe-auto justify-content-between title2"
                        onClick={() => {
                            let isSubLayerVisible = isSubLayerVisibleRecursive(data)
                            if (isSubLayerVisible != subLayersVisible) {
                               setSubLayersVisible(isSubLayerVisible)
                            }
                            setExpanded(!expanded)
                        }}
                    >
                        <Tooltip 
                            placement="right"
                            title={data.layer.sourceJSON && data.layer.sourceJSON.description ? data.layer.sourceJSON.description : "No description available."}
                            showArrow
                        >
                            <div style={{ paddingRight:"10px" }}>
                                {expanded ? <FontAwesomeIcon icon={faFolderOpen} size="lg" /> : 
                                !subLayersVisible ? <FontAwesomeIcon icon={faFolder} size="lg" /> : 
                                <div  style={{ position:"relative", height: "14px", width: "18px", display: "inline-block" }}>
                                    <FontAwesomeIcon 
                                        icon={faFolder} 
                                        size="lg"
                                        style={{
                                            position:"absolute"
                                        }} 
                                    /> 
                                    {<FontAwesomeIcon 
                                        icon={faEye} 
                                        size="sm"
                                        style={{
                                            position:"absolute", 
                                            fontSize: "12px", 
                                            left:"6px", 
                                            top:"6px", 
                                            background:"#fff"
                                        }} 
                                    />}
                                    {/*<FontAwesomeIcon 
                                        icon={faCircleDown} 
                                        size="sm"
                                        style={{
                                            position:"absolute", 
                                            fontSize: "12px", 
                                            left:"7px", 
                                            top:"7px", 
                                            background:"#fff", 
                                            display: "none" 
                                        }} 
                                    />*/}
                                </div>
                                }
                                <span style={{marginLeft:"8px", position:"relative", top:"1px", fontSize:"14px", lineHeight:"16px"}}>{data.title}</span>
                            </div>
                        </Tooltip>
                    </Row>
                    {expanded ? 
                        <Container className="m-0 p-0 pl-4">
                            {
                            data.layers.map((sublayer) => {
                                return (
                                    <TreeComponentRecursive 
                                        data={sublayer} 
                                        componentType={componentType}
                                        layerVisibility={layerVisibility}
                                        onInputCheckedChange={onInputCheckedChange}
                                        view={view}
                                        mapServices={mapServices}
                                        mapScale={mapScale}
                                        legendData={legendData}
                                        layerLoading={layerLoading}
                                        isSubLayerVisibleRecursive={isSubLayerVisibleRecursive}
                                    />
                                )
                            })
                        }
                        </Container>
                    : null}
                </Container>
            </div>
        ) : (
            <>
                {
                    data.layers.map((sublayer) => {
                        return (
                            <TreeComponentRecursive 
                                data={sublayer} 
                                componentType={componentType}
                                layerVisibility={layerVisibility}
                                onInputCheckedChange={onInputCheckedChange}
                                view={view}
                                mapServices={mapServices}
                                mapScale={mapScale}
                                legendData={legendData}
                                layerLoading={layerLoading}
                                isSubLayerVisibleRecursive={isSubLayerVisibleRecursive}
                            />
                        )
                    })
                }
            </>
        )
    );
};

const SimpleLegend = ({
    renderer, 
    opacity
}: any) => {
    const [symbolNode, setSymbolNode] = useState(null);
    //const [labelNode, setLabelNode] = useState(null);
    //const [style, setStyle] = useState(null);
    const legendNode = useRef(null)
    
    useEffect(() => {
        async function getSymbol(symbol) {
            console.log('there')
            let renderNode = await symbolUtils.renderPreviewHTML(symbol)
            setSymbolNode(renderNode)
            let symbolNode = document.createElement("div");
            symbolNode.style.cssText = `opacity:{opacity};padding: 2px 0px 2px ${(symbol.type.includes("marker") && renderNode.tagName == "DIV") ? 6 : 0}px;`
            symbolNode.append(renderNode)
            legendNode.current.appendChild(symbolNode);
            
            let labelNode = document.createElement("div");
            labelNode.textContent = renderer.label
            legendNode.current.appendChild(labelNode);
        }
        
        if (!symbolNode) {
            console.log(legendNode.current.children)
            getSymbol(renderer.symbol)
        }
    }, [])
        
    return <div className="d-flex flex-row m-0 p-0" ref={legendNode}>
            
        </div>
}

const BivariateLegend = ({
    renderer, 
    opacity
}: any) => {
    const [symbolNode, setSymbolNode] = useState(null);
    //const [labelNode, setLabelNode] = useState(null);
    //const [style, setStyle] = useState(null);
    const legendNode = useRef(null)
    
    useEffect(() => {
        async function getSymbol(symbol) {
            console.log('there')
            let renderNode = await symbolUtils.renderPreviewHTML(symbol)
            setSymbolNode(renderNode)
            let symbolNode = document.createElement("div");
            symbolNode.style.cssText = `opacity:{opacity};padding: 2px 0px 2px ${(symbol.type.includes("marker") && renderNode.tagName == "DIV") ? 6 : 0}px;`
            symbolNode.append(renderNode)
            legendNode.current.appendChild(symbolNode);
            
            let labelNode = document.createElement("div");
            labelNode.textContent = renderer.label
            legendNode.current.appendChild(labelNode);
        }
        
        if (!symbolNode) {
            console.log(legendNode.current.children)
            getSymbol(renderer.symbol)
        }
    }, [])
        
    return <div className="d-flex flex-row m-0 p-0" ref={legendNode}>
        </div>
}

const ContinuousColorLegend = ({
    colors,
}: any) => {
    const canvasRef = useRef(null);
    let width = 25
    let height = 75
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let pr = window.devicePixelRatio
        let w = width * pr
        let h = height * pr

        const gradient = context.createLinearGradient(0, 0, 0, h);
        let c = colors.length;
        const q = 1 === c ? 0 : 1 / (c - 1);
        colors.forEach( (color, i) => gradient.addColorStop(i * q, color.toString()));
        context.fillStyle = gradient;
        context.fillRect(0, 0, w, h)
    }, []);

    return (
        <div className="d-flex flex-column justify-content-center" style={{height: "85px"}}>
            <canvas ref={canvasRef} width={width} height={height} style={{ width: width+"px" height:height+"px"}}/>
        </div>
    );
};

const NestedGraduatedSymbolLegend = ({
    fillColors,
    strokeColor,
    labelValues,
    symbolSizes,
    symbolStyle,
    legendStyle,
    maxSize,
    minSize,
    legendId
}: any) => {
    
    let numOfSizes = symbolSizes.length
    let lastSizeIndex = symbolSizes.length-1
    let colorOffset = 80/(fillColors.length-1)
    let fillColor = Array.isArray(fillColors) ? "none" : fillColors
    let padding = 10
    let offset = padding/2
    let height = maxSize+padding
    
    let symbolNode = (
        <div style={{ position:"relative", height:`${height+padding}px`}}>
            <svg width="200" height={height+offset}>
                {legendStyle == "gradient" &&
                        <defs>
                            <linearGradient id={`gradient-${legendId}`} x1="0" x2="0" y1="0" y2="1">
                                {
                                    fillColors.map((color,i) => {
                                        return <stop offset={`${colorOffset*i + 10}%`} stop-color={color.toString()} />
                                    })
                                
                                }
                            </linearGradient>
                        </defs>
                }
                {
                    symbolSizes.map((size,i) => {
                        let svgShape = null
                        if symbolStyle == "circle" {
                            svgShape = <circle 
                                cx={maxSize/2 + offset}  
                                cy={height - size/2} 
                                r={size/2} 
                                fill={ legendStyle == "gradient" ? "none" : fillColor.toHex() }
                                stroke={ ["gradient", "continuous-fill"].includes(legendStyle) ? "#ccc" : strokeColor.toString() }
                                stroke-width="2"
                                stroke-dasharray={![0,lastSizeIndex].includes(i) && legendStyle != "graduated-fill" ? "3" : "none"}
                                stroke-opacity={(![0,lastSizeIndex].includes(i) && legendStyle == "gradient") ? "0.35" : (![0,lastSizeIndex].includes(i) && legendStyle == "continuous-fill") ? "0.7" : "1"}
                            />
                        }
                        
                        if symbolStyle == "square" {
                            svgShape = <rect 
                                width={size}
                                height={size} 
                                x={offset} 
                                y={height - size}
                                fill={ legendStyle == "gradient" ? "none" : fillColor.toHex() }
                                stroke={ ["gradient", "continuous-fill"].includes(legendStyle) ? "#ccc" : strokeColor.toString() }
                                stroke-width="2"
                                stroke-dasharray={![0,lastSizeIndex].includes(i) && legendStyle != "graduated-fill" ? "3" : "none"}
                                stroke-opacity={(![0,lastSizeIndex].includes(i) && legendStyle == "gradient") ? "0.35" : (![0,lastSizeIndex].includes(i) && legendStyle == "continuous-fill") ? "0.7" : "1"}
                            />
                        }
                        
                        if symbolStyle == "triangle" {
                            svgShape = <path 
                                //d={`M ${size/2 + offset} ${height - size} L ${size/2 + offset + size/2} ${height} L ${maxSize/2 + offset - size/2} ${height} Z`}
                                d={`M ${maxSize/2 + offset} ${height - size} L ${maxSize/2 + offset + size/2} ${height} L ${maxSize/2 + offset - size/2} ${height} Z`}
                                stroke={ ["gradient", "continuous-fill"].includes(legendStyle) ? "#ccc" : strokeColor.toString() }
                                fill={ legendStyle == "gradient" ? "none" : fillColor.toHex() }
                                stroke-width="2"
                                stroke-dasharray={![0,lastSizeIndex].includes(i) && legendStyle != "graduated-fill" ? "3" : "none"}
                                stroke-opacity={(![0,lastSizeIndex].includes(i) && legendStyle == "gradient") ? "0.35" : (![0,lastSizeIndex].includes(i) && legendStyle == "continuous-fill") ? "0.7" : "1"}
                            />
                        }
                        
                        return svgShape
                    })
                }
                {
                    symbolSizes.map((size,i) => {
                        if (![1,3].includes(i) || legendStyle == "graduated-fill") { 
                            let leaderOffset = legendStyle == "gradient" ? 25 : 15
                            return <line 
                                x1={symbolStyle == "square" ? offset + size : maxSize/2 + offset } 
                                y1={height - size} 
                                x2={maxSize + leaderOffset} 
                                y2={height - size} 
                                stroke="#ccc" 
                                stroke-width="1" 
                            />
                        } else {
                            return null
                        }
                    })
                }
                {
                    labelValues.map((value,i) => {
                        let pad = (value.includes(">") || value.includes("<") && legendStyle != "graduated-fill") ? 0 : 12
                        let textOffset = legendStyle == "gradient" ? 30 : legendStyle == "continuous-fill" ? 20 : 10
                        if (![1,3].includes(i) || legendStyle == "graduated-fill") { 
                            return <text 
                                x={maxSize + textOffset + pad}  
                                y={height - symbolSizes[i] + 4}
                                font-size="12px"
                            >
                                {value}
                            </text>
                        } else {
                            return null
                        }
                    })
                }
                {legendStyle == "gradient" &&
                    <rect 
                        width="10" 
                        height={maxSize - minSize} 
                        x={maxSize + 10} 
                        y={height - maxSize} 
                        fill={`url(#gradient-${legendId})`}
                    />
                }
            </svg>
        </div>)
    
    return symbolNode
}

const GradientPolylineLegend = ({
    fillColors,
    fillValues,
    strokeColor,
    legendStyle,
    maxWidth,
    minWidth,
    maxValue,
    minValue,
    dashArray,
    legendId
}: any) => {
    
    minWidth = minWidth < 1 ? 1.25 : minWidth
    
    let xOffset = 5
    let yOffset = 5
    
    let width = 60
    let height = 80
    let pad = dashArray ? 1 : 0
    
    let scalar = maxValue/1000 >= 1 ? 1000 : maxValue/100 >= 1 ? 100 : 10
    let middleValue = Math.round(((maxValue - minValue)/2)/scalar)*scalar
    let middleWidth = (maxWidth + minWidth)/2
    
    let topDash = dashArray ? dashArray[0] : "none"
    let middleDash = dashArray ? dashArray[Math.floor((dashArray.length - 1) / 2)] : "none"
    let bottomDash = dashArray ? dashArray[dashArray.length-1] : "none"
    
    let xTopLeft = 0 + xOffset - pad
    let xTopRight = width - xOffset + pad
    let yTopLeft = 0 + yOffset
    let yTopRight = 0 + yOffset

    let xBottomLeft = xTopLeft + 20 - pad
    let xBottomRight = xTopRight - 20 + pad
    let yBottomLeft = height - yOffset
    let yBottomRight = height - yOffset
    
    let xMiddleLeft = xTopLeft + xBottomLeft/2 - pad
    let xMiddleRight = xTopRight - xBottomLeft/2 + pad
    let yMiddleRight = yTopLeft + (yBottomLeft - yTopLeft)/2
    let yMiddleLeft = yTopLeft + (yBottomLeft - yTopLeft)/2
    
    let colorOffset = (fillColors) ? 100/(fillColors.length-1) : 0

    width = legendStyle == "gradient" ? 75 : width
    
    return (
        <div className="d-flex flex-row m-0 p-0">
            <div className="d-flex flex-column justify-content-center" style={{height: (height+10)+"px"}}>
                <svg width={width} height={height+5}>
                    {legendStyle == "gradient" &&
                        <defs>
                            <linearGradient id={`gradient-${legendId}`} x1="0" x2="0" y1="0" y2="1">
                                {
                                    fillColors.map((color,i) => {
                                        return <stop offset={`${colorOffset*i + 10}%`} stop-color={color.toString()} />
                                    })
                                
                                }
                            </linearGradient>
                        </defs>
                    }
                    <path 
                        d={`M${xTopRight} ${yTopRight} L${xBottomRight} ${yBottomRight} M${xBottomLeft} ${yBottomLeft} L${xTopLeft} ${yTopLeft}`} 
                        fill="none"
                        stroke="#ccc" 
                        stroke-width="2"
                        stroke-dasharray="2,4"
                    />
                    <line 
                        x1={xTopLeft} 
                        y1={yTopLeft} 
                        x2={xTopRight} 
                        y2={yTopRight} 
                        stroke={ legendStyle == "gradient" ? "#ccc" : strokeColor.toString() } 
                        stroke-width={maxWidth}
                        stroke-linecap="round"
                        stroke-dasharray={topDash}
                    />
                    <line 
                        x1={xMiddleLeft} 
                        y1={yMiddleLeft} 
                        x2={xMiddleRight} 
                        y2={yMiddleRight} 
                        stroke={ legendStyle == "gradient" ? "#ccc" : strokeColor.toString() } 
                        stroke-width={middleWidth}
                        stroke-linecap="round"
                        stroke-dasharray={middleDash}
                    />
                    <line 
                        x1={xBottomLeft} 
                        y1={yBottomLeft} 
                        x2={xBottomRight} 
                        y2={yBottomRight} 
                        stroke={ legendStyle == "gradient" ? "#ccc" : strokeColor.toString() } 
                        stroke-width={minWidth}
                        stroke-linecap="round"
                        stroke-dasharray={bottomDash}
                    />
                    {legendStyle == "gradient" &&
                        <rect 
                            width="10" 
                            height={yBottomLeft - yTopLeft + maxWidth/2 + minWidth/2} 
                            x={xTopRight + 10} 
                            y={yTopRight - maxWidth/2} 
                            fill={`url(#gradient-${legendId})`}
                        />
                    }
                </svg>
            </div>
            <div className="ml-2 d-flex flex-column justify-content-between" style={{height: (height+10)+"px", fontSize:"12px"}}>
                <div style={{position:"relative", top:"-2px"}}>{`> ${maxValue}`}</div>
                <div style={{position:"relative", top:"0px"}}>{middleValue}</div>
                <div style={{position:"relative", top:"-2px"}}>{`< ${minValue}`}</div>
            </div>
        </div>
    );
};
    
export default function (props: AllWidgetProps<IMConfig>) {
    const [view, setView] = useState(null);
    const [map, setMap] = useState(null);
    const [mapServices, setMapServices] = useState(null);
    const [mapLayers, setMapLayers] = useState(null);
    const [mapScale, setMapScale] = useState(10000000);
    const [defaultVisibility, setDefaultVisibility] = useState({})
    const [layerVisibility, setLayerVisibility] = useState({})
    const [legendData, setLegendData] = useState(null);
    const [widgetLoading, setWidgetLoading] = useState(true);
    const [layerLoading, setLayerLoading] = useState(null);
    
    const [isOpen, setIsOpen] = useState(false)
    
    const [wuiVulnerabilityWidgetId, setWuiVulnerabilityWidgetId] = useState(null)
    const [wuiDataExplorerWidgetId, setWuiDataExplorerWidgetId] = useState(null)
    const [wuiGrowthWidgetId, setWuiGrowthWidgetId] = useState(null)
    const [sideBySidePanelId, setSideBySidePanelId] = useState(null)
    
    const [isMainMapPanel, setIsMainMapPanel] = useState(true)
    
    const widgetState = useSelector((state: IMState) => {
        let widgetState = null;
        if (sideBySidePanelId) {
            widgetState = state.widgetsState[sideBySidePanelId]
        }
        return widgetState
    })
    
    const sideBySidePanelCollapse = useSelector((state: IMState) => {
        let value = null;
        if (sideBySidePanelId) {
            value = state.widgetsState[sideBySidePanelId].collapse;
        }
        return value
    })
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (sideBySidePanelCollapse) {
            if (!isMainMapPanel && mapLayers) {
                setIsOpen(false);
                Object.values(mapLayers).forEach((section) => {
                    resetMapLayerVisibility(section.group, section.componentType)
                });
            }
        }
    }, [sideBySidePanelCollapse, dispatch])
    
    const sendWidgetMessages = () => {
        getAppStore().dispatch(appActions.widgetStatePropChange(wuiGrowthWidgetId, "activeWidgetId", Math.random()));
        getAppStore().dispatch(appActions.widgetStatePropChange(wuiVulnerabilityWidgetId, "activeWidgetId", Math.random()));
    }
    
    useEffect(() => {
        if (props) {
            //console.log(props)
            let appConfig = getAppStore().getState().appConfig;
            let widgets = Object.values(appConfig.widgets);
            
            let currentWidgetType = props.label.split('-').pop();
            setIsMainMapPanel(currentWidgetType == 'main');
            
            let sidebarWidget = widgets.find(w => w.label == 'Side by Side Maps')
            if (sidebarWidget) {
                setSideBySidePanelId(sidebarWidget.id);
            }
            
            let growthWidget = widgets.find(w => w.label == `wui-growth-${currentWidgetType}`);
            if (growthWidget) {
                setWuiGrowthWidgetId(growthWidget.id);
            }
            
            let dataExplorerWidget = widgets.find(w => w.label == `layer-control-${currentWidgetType}`);
            if (dataExplorerWidget) {
                setWuiDataExplorerWidgetId(dataExplorerWidget.id);
            }
            
            let vulnerabilityWidget = widgets.find(w => w.label == `wui-vulnerability-${currentWidgetType}`);
            if (vulnerabilityWidget) {
                setWuiVulnerabilityWidgetId(vulnerabilityWidget.id);
            }
        }
    },[props])
    
    useEffect(() => {
        if (props.stateProps) {
            if (isOpen) {
                setIsOpen(false);
                Object.values(mapLayers).forEach((section) => {
                    resetMapLayerVisibility(section.group, section.componentType)
                });
            }
        }
    }, [props.stateProps])
    
    useEffect(() => {
        if (props.mutableStateProps?.queryResults) {
            console.log(props.mutableStateProps?.queryResults)
        }
    },[props.mutableStateProps?.queryResults])
    
    let closeLayerLoading = setTimeout(() => {
       setLayerLoading(null)
    }, 3000);
    
    useEffect(() => {
        if (view) {
            setMap(view.map)
            setMapScale(view.scale)
            
            view.watch("extent", function() {
                setMapScale(view.scale)
            })
            
            view.watch("updating", function(updating){
                clearTimeout(closeLayerLoading);
                if (updating) {
                    closeLayerLoading = setTimeout(() => {
                       setLayerLoading(null)
                    }, 3000);
                }
            });
        }
    }, [view, layerLoading])
    
    useEffect(() => {
        if (mapServices) {
            //console.log(mapServices)
        }
    }, [mapServices])
    
    useEffect(() => {
        if (legendData) {
            //console.log(legendData)
        }
    }, [legendData])
    
    useEffect(() => {
        if (map) {
            let layers = {}
            let defaultVis = {}
            let layerVis = {}
            map.layers.forEach((layer) => {
                if (layer.type == "group") {
                    let [title, queryString] = layer.title.split("?")
                    let group = title.replace(/\s+/g, '-').toLowerCase()
                    
                    let config = {}
                    if (queryString) {
                        config = queryStringToJSON(queryString)
                    }
                    
                    layers[group] = {
                        title: title,
                        group: group, 
                        layers: createMapLayersTree(layer),
                        componentType: (props.config.radioGroupLayerId.includes(layer.id)) ? "radio" : "check", 
                        config: config 
                    }
                    
                    defaultVis[group] = createMapLayersVisible(layers[group].layers)
                    layerVis[group] = []
                    defaultVis[group].forEach((w) => { 
                        if (w.visible) {
                            layerVis[group].push(w.layer.uid)
                        }
                        if (w.layers) {
                            w.layers.forEach((x) => {
                                if (x.visible) {
                                    layerVis[group].push(x.uid)
                                }
                            })
                        }
                    })
                }
            })
            //console.log(layers)
            setMapLayers(layers)
            //console.log(defaultVis)
            setDefaultVisibility(defaultVis)
            //console.log(layerVis)
            setLayerVisibility(layerVis)
            
            setWidgetLoading(false)
        }
    }, [map])
    
    useEffect(() => {
        if (mapLayers && map) {
            requestLegends(mapLayers).then((legends) => {
                //console.log(legends)
                createLegendNodes(legends)
            })
            //console.log(mapLayers)
        }
        
    }, [mapLayers, map])
    
    function createMapLayersTree(layer) {
        let layers = []
        let group = layer.title.split("?")[0].replace(/\s+/g, '-').toLowerCase()
        layer.layers.forEach((w,i) => {
            let layerTree = mapLayersTreeRecursive(w, group, null)
            layers.push(layerTree)
        })
        layers.reverse()
        return layers
    }
    
    function mapLayersTreeRecursive(layer, group, parent) {
        const [layerTitle, queryString] = layer.title.split("?")
        let config = null
        if (queryString) {
            config = queryStringToJSON(queryString)
        }
        let node = {
            layer: layer,
            title: layerTitle,
            group: group,
            type: layer.type,
            url: layer.url,
            id: layer.id,
            serviceId: layer.type == "map-image" || layer.type == "group" ? null : layer.type == "imagery" ? 0 : layer.sourceJSON.id,
            uid: layer.uid,
            visible: layer.visible,
            layers: null,
            folder: layer.sublayers != null || layer.type == "group",
            node: layer.type != "map-image" || config && config.node,
            config: config
        }
        let parentLayer = parentLayerRecursive(layer)
        node.parent = (parentLayer) ? parentLayer.id : null
        
        if (layer.type != "group" && layer.sublayers == null) {
            return node;
        } else {
            let sublayers = (layer.type == "group") ? layer.layers : layer.sublayers
            node.layers = sublayers.items.map(sublayer => mapLayersTreeRecursive(sublayer, group, node)).reverse();
            return node
        }
    }
    
    function parentLayerRecursive(layer) {
        if (!layer.parent.type || (layer.parent.type && layer.parent.type == "group") || (layer.parent.type && layer.parent.type != "sublayer")) {
            return (!layer.parent.type || (layer.parent.type && layer.parent.type == "group")) ? null : layer.parent
        }
        return parentLayerRecursive(layer.parent)
    }
    
    function createMapLayersVisible(layer) {
        let layers = {}
        layer.forEach((l) => {
            let ls = mapLayersVisibleRecursive(l, {})
            for (const s in ls) {
                if (layers[s]) {
                    layers[s].layers = [...layers[s].layers, ...ls[s].layers]
                } else {
                    layers[s] = ls[s]
                }
            }
        })
        return Object.values(layers)
    }
    
    function mapLayersVisibleRecursive(layer, layers) {
        let layerServices = { ...layers}
        if (layer.layers == null) {
            let serviceId = layer.parent ? layer.parent : layer.id
            let service = map.findLayerById(serviceId);
            let lyr = {
                uid: layer.uid,
                serviceId: layer.serviceId,
                visible: layer.visible
            }
            if (layerServices[serviceId]) {
                if (layerServices[serviceId].layers) {
                    layerServices[serviceId].layers.push(lyr)
                }
            } else {
                layerServices[serviceId] = {
                    layer: service,
                    visible: layer.visible
                }
                if (layer.parent) {
                    layerServices[serviceId].layers = [lyr]
                }
            }
            
            return layerServices;
        }
        
        layer.layers.forEach((sublayer) => {
            layerServices = mapLayersVisibleRecursive(sublayer, layerServices)
        })
        return layerServices;
    
    }
    
    function getMapLayer(group, uid) {
        let layers = mapLayers[group].layers
        let node = null
        for (let i = 0; i < layers.length; i++) {
            node = mapLayerRecursive(layers[i], uid);
            if (node) { break }
        }
        return node
    }
    
    function mapLayerRecursive(layer, uid) {
        if (layer.uid == uid) {
            return layer
        }
        let node = null
        if (layer.layers) {
            layer.layers.some((l) => { 
                node = mapLayerRecursive(l,uid)
                return node != null
            })
        }
        return node
    }
    
    async function requestLegends(layers) {
        let legends = {}
        for (const section in layers) {
            let services = getLegendServiceUrls(layers[section].layers)
            let promises = services.map((service) => {
                return esriRequest(service.url);
            })
            let responses = await Promise.all(promises);
            let data = await Promise.all(responses.map(response => response.data));
            
            services.forEach((service,i) => {
                service.layers.forEach((layer) => {
                    let layerId = layer.uid
                    let serviceId = layer.serviceId
                    let idProp = (service.type == "feature") ? "id" : "layerId"
                    legends[layerId] = []
                    if (data[i].layers) {
                        let legend = data[i].layers.find((l) => { 
                            return l[idProp] == serviceId
                        })
                        let opacity = layer.opacity
                        let renderer = (service.type == "feature" && layer.renderer) ? layer.renderer : (service.type == "feature" && !layer.renderer) ? rendererJsonUtils.fromJSON(legend.drawingInfo.renderer) : legend.legend
                        let legendItem = {
                            id: layerId,
                            type: service.type,
                            renderer: renderer,
                            opacity : opacity
                        }
                        legends[layerId] = legendItem
                    }
                })
            })
        }
        return legends
    }
    
    function getLegendServiceUrls(section) {
        let legendServices = {}
        section.forEach((node) => {
            let ls = legendServiceUrlsRecursive(node, {})
            for (const s in ls) {
                if (legendServices[s]) {
                    legendServices[s].layers = [...legendServices[s].layers, ...ls[s].layers]
                } else {
                    legendServices[s] = ls[s]
                }
            }
        })
        return Object.values(legendServices)
    }
    
    function legendServiceUrlsRecursive(layer, services) {
        let legendServices = { ...services}
        if (layer.layers == null) {
            let serviceId = layer.parent ? layer.parent : layer.id
            let service = map.findLayerById(serviceId);
            let serviceUrl = service.url
            let legendUrl = (service.type == "feature") ? `${serviceUrl}/layers?f=json` : `${serviceUrl}/legend?f=json`; 
            let lyr = {
                uid: layer.uid,
                serviceId: layer.serviceId,
                opacity: layer.layer.opacity,
                renderer: (layer.type == "feature" && layer.layer.renderer) ? layer.layer.renderer : null
            }
            if (legendServices[service.url]) {
                legendServices[service.url].layers.push(lyr)
            } else {
                legendServices[service.url] = {
                    type: service.type,
                    url: legendUrl,
                    layers: [lyr]
                }
            }
            
            return legendServices;
        }
        layer.layers.forEach((sublayer) => {
            legendServices = legendServiceUrlsRecursive(sublayer, legendServices)
        })
        return legendServices;
    }
    
    async function createLegendNodes(legends) {
        let legendNodes = {}
        let promises = Object.values(legends).map((l) => {
            return legendNode(l);
        })
        let responses = await Promise.all(promises);
        responses.forEach((node,i) => {
            legendNodes[Object.keys(legends)[i]] = node
        })
        setLegendData(legendNodes)
    }
    
    async function legendNode(legend) {
        let renderer = legend.renderer
        let opacity = legend.opacity
        if (legend.type != "feature") {
            return createMapImageLegend(renderer)
        } else {
            if (renderer.type == "simple") {
                return createSimpleLegend(renderer, opacity)
                //return <SimpleLegend renderer={renderer} opacity={opacity} /> 
            } else if (renderer.type == "heatmap"){
                return createHeatMapLegend(renderer)
            } else if (renderer.type == "unique-value") {
                let values = renderer.uniqueValueInfos.map(v => return v.value)
                if (renderer.uniqueValueInfos.map(v => return v.value).includes("High - High")) {
                    return createBivariateLegend(legend)
                } else {
                    return createUniqueOrClassBreaksLegend(renderer)
                }
            }  else if (renderer.type == "class-breaks") {
                if (renderer.classBreakInfos.length > 1 || (renderer.classBreakInfos.length == 1 && !renderer.visualVariables)) {
                    return createUniqueOrClassBreaksLegend(renderer)
                } else if (renderer.classBreakInfos.length == 1 && renderer.authoringInfo.classificationMethod == "manual" && renderer.visualVariables) {
                    let colorVisualVariable = renderer.visualVariables.find((v) => { return v.type == "color" })
                    let sizeVisualVariable = renderer.visualVariables.find((v) => { return v.type == "size" })
                    
                    if ((colorVisualVariable && !sizeVisualVariable) || (colorVisualVariable && sizeVisualVariable && !sizeVisualVariable.maxSize)) {
                        return createContinuousColorLegend(renderer)
                    } 
                    
                    if (sizeVisualVariable && !colorVisualVariable) {
                        return createContinuousColorSizeLegend(renderer, "size", legend.id)
                    }
                    
                    if (renderer.authoringInfo.type == "univariate-color-size") {
                        return createContinuousColorSizeLegend(renderer, "color-size", legend.id)
                    }
                }
            } else {
                return null
            }
        }
    }
    
    async function createSimpleLegend(renderer, opacity) {
        let symbol = renderer.symbol.clone();
        let renderNode = await symbolUtils.renderPreviewHTML(symbol)
        let style = {
            opacity: opacity,
            padding : `2px 0px 2px ${(symbol.type.includes("marker") && renderNode.tagName == "DIV") ? 6 : 0}px`
        }
        let node = parse(renderNode.outerHTML)
        let label = renderer.label
        
        let symbolNode = <div className="d-flex flex-row m-0 p-0">
                <div 
                    style={style}
                >
                    {node}
                </div>
                <div>
                    {label}
                </div>
            </div>
        
        return symbolNode
    }
    
    async function createBivariateLegend(node) {
        let renderer = node.renderer
        //console.log(renderer)
        
        let layer = null
        for (const group in mapLayers) {
            layer = getMapLayer(group, node.id)
            if (layer) {
                break
            }
        }
        
        let values = renderer.uniqueValueInfos.map(v => return v.value);
        let var1 = [...new Set(values.map(v => return v.split(' - ')[0]))];
        let var2 = [...new Set(values.map(v => return v.split(' - ')[1]))];
        var2.reverse()
        
        let title1 = layer.title.split(' & ')[0].split(' (')[0]
        let title2 = layer.title.split(' & ')[1].split(' (')[0]
        
        let colors = {}
        let baseSymbol = renderer.uniqueValueInfos[0].symbol
        if (baseSymbol.type == "cim") {
            renderer.uniqueValueInfos.forEach((v) => {
                let f = v.symbol.data.symbol.symbolLayers.find(l => l.type == 'CIMSolidFill')
                let color = new Color(f.color.slice(0,4)).toHex()
                colors[v.value] = color
            })
        }
        
        let symbolNode = (
            <div 
                className="mt-3 mb-2 ml-2 bivariate"
            >
                <div>
                    <div
                        className="d-flex flex-row"
                    >
                        <div 
                            style={{
                                display:"flex" 
                                width: "20px", 
                                height: "90px",
                                marginRight: title1.length > 18 ? "5px" : "-2px",
                            }}
                        >
                            <div 
                                style={{
                                    fontSize:"10px", 
                                    flex: "0 0 15px",
                                    display: "flex",
                                    justifContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:"10px", 
                                        rotate:"-90deg",
                                        textAlign: "center",
                                        lineHeight:1,
                                        width: "90px", 
                                        height: "90px", 
                                    }}
                                >
                                {title1}
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            style={{
                                display:"flex" 
                                width: "20px", 
                                height: "90px",
                                marginRight: "-5px",
                                overflow:"hidden",
                            }}
                        >
                            <div 
                                style={{
                                    fontSize:"10px", 
                                    display: "flex",
                                    
                                    alignItems: "center",
                                }}
                            >
                                
                                
                                <div
                                    style={{
                                        fontSize:"10px", 
                                        rotate:"-90deg",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginLeft: "-40px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize:"10px",
                                            width:"45px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Low
                                    </div>
                                    <div
                                        style={{
                                            fontSize:"10px",
                                            width:"45px",
                                            textAlign: "right",
                                        }}
                                    >
                                        High
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        
                        
                        <div className="d-flex flex-column">
                        
                            <div>
                                {var1.map((row,i) => {
                                return (
                                    <div 
                                        key={row} 
                                        className="d-flex flex-row"
                                        style={{ height:"30px"}}
                                    >
                                        {var2.map((col,j) => {
                                            return (
                                                <div
                                                    key={`${row} - ${col}`}
                                                    className={col}
                                                    style={{ 
                                                        width:"30px", 
                                                        height:"30px", 
                                                        border:"none", 
                                                        background: Object.keys(colors).length > 0 ? colors[`${row} - ${col}`]: "#ffffff",
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                    )
                                })}
                            </div>
                            
                            <div
                              style={{
                                    fontSize:"10px", 
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:"10px",
                                        width:"45px",
                                        textAlign: "left",
                                    }}
                                >
                                    Low
                                </div>
                                <div
                                    style={{
                                        fontSize:"10px",
                                        width:"45px",
                                        textAlign: "right",
                                    }}
                                >
                                    High
                                </div>
                            </div>
                            
                            <div 
                                style={{
                                    fontSize:"10px", 
                                    textAlign: "center",
                                }}
                            >
                                {title2}
                            </div>
                        
                        
                        </div>
                    
                    
                    </div>

                </div>
            </div>
          );
          
          return symbolNode
    }
    
    async function createUniqueOrClassBreaksLegend(renderer) {
        let rendererTypes = {
            "unique-value": "uniqueValueInfos"
            "class-breaks": "classBreakInfos"
        }
        
        let baseSymbol = renderer[rendererTypes[renderer.type]][0].symbol
        let symbolType = baseSymbol.type
        let infos = renderer[rendererTypes[renderer.type]].reverse()
        let symbolPromises = infos.map((info) => {
            return symbolUtils.renderPreviewHTML(info.symbol);
        })
        let symbolResponses = await Promise.all(symbolPromises);
        let values = infos.map((info,i) => { 
            let label = info.label
            if (renderer.type == "class-breaks") {
                label = label.replace("> ", "").replace("< ", "")
            }
            return label
        })
        let sizes = symbolResponses.map((node) => {
            let svg = node.getElementsByTagName("svg")
            let height = svg.length > 0 ? svg[0].getAttribute("height") : node.getAttribute("height");
            return height
        })
        let maxSize = Math.max(...sizes)
        let minSize = Math.min(...sizes)
        let symbolNode = (<div className="d-flex flex-column align-items-center">
                        {
                            symbolResponses.map((renderNode,i) => {
                                let labelStyle = {
                                    width: "auto", 
                                    height: sizes[i] < 25 ? "25px" : sizes[i] + "px",
                                    lineHeight: sizes[i] < 25 ? "25px" : sizes[i] + "px",
                                    minHeight: "25px",
                                    position: "relative",
                                    top: ["simple-fill", "cim"].includes(symbolType) ? "4px" : "0px",
                                    textAlign: "left",
                                    fontSize: "12px"
                                }
                                let symbolStyle = {
                                    width: maxSize + "px",
                                    height: sizes[i] < 25 ? "25px" : sizes[i] + "px",
                                    minHeight: "25px"
                                }
                                return <div className="w-100 d-flex flex-row">
                                            <div className="mt-1 d-flex align-items-center justify-content-center" style={symbolStyle}>
                                                {parse(renderNode.outerHTML)}
                                           </div>
                                           <div className="mt-1 ml-2" style={labelStyle}>
                                                {values[i]}
                                           </div>
                                       </div>
                            })
                        }
                    </div>)
        
        if (renderer.type == "class-breaks" && baseSymbol.type == "simple-marker" && ["circle", "square", "triangle"].includes(baseSymbol.style) && maxSize >= 70) {
            /*
            let symbolSizes = sizes.map((size) => {
                return (maxSize < 70) ? size * 70/maxSize : size
            })
            maxSize = Math.max(...symbolSizes)
            minSize = Math.min(...symbolSizes)
            */
        
            let strokeColor = baseSymbol.outline.color
            let fillColor = baseSymbol.color
            
            let symbols = infos.map((info,i) => { 
                return info.symbol
            })
            let colors = symbols.map((symbol) => {
                return symbol.color
            })
            let allSameColors = colors.every((c) => {
                return c.toHex() == fillColor.toHex()
            })
            symbolNode = <NestedGraduatedSymbolLegend
                            fillColors={allSameColors ? fillColor : colors}
                            strokeColor={strokeColor}
                            labelValues={values}
                            symbolSizes={sizes}
                            symbolStyle={baseSymbol.style}
                            legendStyle={"graduated-fill"}
                            maxSize={maxSize}
                            minSize={minSize}
                            legendId={"legend"}
                        />
        }
        
        return symbolNode
    
    }
    
    function createContinuousColorLegend(renderer) {
        let colorVisualVariable = renderer.visualVariables.find((v) => { return v.type == "color" })
        let colors = colorVisualVariable.stops.map((s) => s.color)
        colors.reverse()
        let values = colorVisualVariable.stops.map((s) => s.value)
        values.reverse()
        
        let node = <ContinuousColorLegend colors={colors} />
        let label = (<div className="h-100 ml-2 d-flex flex-column justify-content-between" style={{ fontSize: "12px" }}>
                    <div className="continuous-color-legend-value" style={{top:"-2px"}}>{`> ${values[0]}`}</div>
                    <div className="continuous-color-legend-value">{values[Math.floor(values.length/2)]}</div>
                    <div className="continuous-color-legend-value" style={{top:"2px"}}>{`< ${values[values.length-1]}`}</div>
                </div>)
        
        let symbolNode = <div className="d-flex flex-row m-0 p-0">
                <div>
                    {node}
                </div>
                <div>
                    {label}
                </div>
            </div>
        
        return symbolNode
    }
    
    async function createContinuousColorSizeLegend(renderer, legendType, legendId) {
        let colors = []
        let colorValues = null
        let values = []
        let sizes = []
        let symbols = []
        
        let baseSymbol = renderer.classBreakInfos[0].symbol.clone();
        let fillColor = (baseSymbol.type == "simple-marker") ? baseSymbol.color : null
        let strokeColor = (baseSymbol.type == "simple-marker") ? baseSymbol.outline.color : baseSymbol.color
        
        if (legendType == "color-size") {
            let colorVisualVariable = renderer.visualVariables.find((v) => { return v.type == "color" })
            colors = colorVisualVariable.stops.map((s) => s.color).reverse()
            colorValues = colorVisualVariable.stops.map((s) => s.value)
        } else {
            colors = [baseSymbol.color]
        }
        
        let sizeVisualVariable = renderer.visualVariables.find((v) => { return v.type == "size" })
        
        let maxSize = 60
        let minSize = 10
        if (!sizeVisualVariable.maxSize.stops && sizeVisualVariable.maxSize) {
            let maxSizePts = sizeVisualVariable.maxSize
            maxSizePts = (maxSizePts > 70 && baseSymbol.type == "simple-marker") ? 70 : (maxSizePts < 60 && baseSymbol.type == "simple-marker") ? 60 : maxSizePts
            maxSize = maxSizePts * (1 + 1/3) //pts ... px = pts * (1 + 1/3)
            
            let minSizePts = sizeVisualVariable.minSize
            minSizePts = (minSizePts < 10 && baseSymbol.type == "simple-marker") ? 10 : minSizePts
            minSize = minSizePts * (1 + 1/3)
        }
        if (sizeVisualVariable.maxSize.stops) {
            let scales = sizeVisualVariable.maxSize.stops.map((s) => s.value)
            let idx = 0
            let scaleDiff = scales.map((s) => s - mapScale)
            let minScaleDiff = Math.min(...scaleDiff.map(s => Math.abs(s)))
            for (let i = 0; i < scales.length; i++) {
                if ((!scaleDiff.every(s => s < 0) && scaleDiff[i] > 0) || (scaleDiff.every(s => s < 0) && Math.abs(scaleDiff[i]) == minScaleDiff) {
                    idx = i
                    break
                }
            }
            
            let maxSizePts = sizeVisualVariable.maxSize.stops[idx].size 
            maxSizePts = (maxSizePts > 70 && baseSymbol.type == "simple-marker") ? 70 : (maxSizePts < 60 && baseSymbol.type == "simple-marker") ? 60 : maxSizePts
            maxSize = maxSizePts * (1 + 1/3)
            
            let minSizePts = sizeVisualVariable.minSize.stops[idx].size
            minSizePts = (minSizePts < 10 && baseSymbol.type == "simple-marker") ? 10 : minSizePts
            minSize = minSizePts * (1 + 1/3)
            
        }
        let stepSize = (maxSize - minSize)/4
        
        let maxValue = sizeVisualVariable.maxDataValue
        let minValue = sizeVisualVariable.minDataValue
        let stepValue = (maxValue - minValue)/4
        
        for (let i = 0; i < 5; i++) {
            let value = (i==0) ? minValue : (i==4) ? maxValue : Math.round((minValue + stepValue * i)/1000)*1000
            let label = `${i==0 ? '< ' : i==4 ? '> ' : '' }${value}`
            values.push(label)
            
            if (baseSymbol.type == "simple-marker") {
                let symbol = baseSymbol.clone()
                symbol.size = minSize + stepSize * i
                symbols.push(symbol)
            }
            sizes.push(minSize + stepSize * i)
        }
        sizes.reverse()
        values.reverse()
        
        let node = null
        if (baseSymbol.type == "simple-marker") {
             if (["circle", "square", "triangle"].includes(baseSymbol.style)) {
                node = <NestedGraduatedSymbolLegend
                    fillColors={colors.length > 1 ? colors : fillColor}
                    strokeColor={strokeColor}
                    labelValues={values}
                    symbolSizes={sizes}
                    symbolStyle={baseSymbol.style}
                    legendStyle={colors.length > 1 ? "gradient" : "continuous-fill"}
                    maxSize={maxSize}
                    minSize={minSize}
                    legendId={legendId}
                />
            }
        } else if (baseSymbol.type == "simple-line") {
            if (["solid"].includes(baseSymbol.style)) {
                node = <GradientPolylineLegend 
                    fillColors={colors.length > 1 ? colors : fillColor}
                    fillValues={colorValues}
                    strokeColor={strokeColor}
                    legendStyle={colors.length > 1 ? "gradient" : "continuous-fill"}
                    maxWidth={maxSize} 
                    minWidth={minSize}
                    maxValue={maxValue}
                    minValue={minValue}
                    dashArray={null}
                    legendId={legendId}
                />
            } else {
                let symbols = sizes.map((s) => {
                    let symbol = baseSymbol.clone()
                    symbol.width = s
                    return symbol
                })
                let symbolPromises = symbols.map((symbol) => {
                    return symbolUtils.renderPreviewHTML(symbol);
                })
                let symbolResponses = await Promise.all(symbolPromises);
                let dashArray = symbolResponses.map((node) => {
                    return node.getElementsByTagName("path")[0].getAttribute("stroke-dasharray")
                })
                
                node = <GradientPolylineLegend 
                    fillColors={colors.length > 1 ? colors : fillColor}
                    fillValues={colorValues}
                    strokeColor={strokeColor}
                    legendStyle={colors.length > 1 ? "gradient" : "continuous-fill"}
                    maxWidth={maxSize} 
                    minWidth={minSize}
                    maxValue={maxValue}
                    minValue={minValue}
                    dashArray={dashArray}
                    legendId={legendId}
                />
            }
        }
        
        return node
    }
    
    function createMapImageLegend(renderer) {
        let symbolNode = renderer.map(i => (
            <div style={{ padding:"2px 0px" }}>
                <img src={`data:image/png;base64,${i.imageData}`} width={i.width} height={i.height} />
                <span style={{ position:"relative", marginLeft:"10px", top:"3px", fontSize: "12px"}}>{i.label}</span>
            </div>
        ))
        
        return symbolNode
    }
    
    function createHeatMapLegend(renderer) {
        let colors = renderer.colorStops.map((s) => s.color)
        colors.reverse()
        
        let node = <ContinuousColorLegend colors={colors} />
        let label = (<div className="h-100 ml-2 d-flex flex-column justify-content-between" style={{ fontSize: "12px" }}>
                    <div>{"High"}</div>
                    <div></div>
                    <div>{"Low"}</div>
                </div>)
        
        let symbolNode = <div className="d-flex flex-row m-0 p-0">
                <div>
                    {node}
                </div>
                <div>
                    {label}
                </div>
            </div>
        
        return symbolNode
    }
    
    function isSubLayerVisibleRecursive(layer) {
        if (!layer.folder && layer.layer.visible) {
            return true
        }
        let visible = false
        if (layer.layers) {
            layer.layers.some((l) => { 
                visible = isSubLayerVisibleRecursive(l)
                return visible == true
            })
        }
        return visible
    }
    
    function onInputCheckedChange(checked, layer, componentType) {
        let layerVis = {...layerVisibility}
        setLayerLoading(layer.uid)
        
        if (componentType == "radio") {
            
            if (layerVis[layer.group].length > 0) {
                let visibleLayer = getMapLayer(layer.group, layerVis[layer.group][0])
                setMapLayerVisibility(visibleLayer, false, "radio")
            }
            layerVis[layer.group] = []
            if (checked) {
                layerVis[layer.group].push(layer.uid)
                setMapLayerVisibility(layer, true, "radio")
            }
        } else {
            
            if (checked) {
                layerVis[layer.group].push(layer.uid)
            } else {
                layerVis[layer.group] = layerVis[layer.group].filter((uid) =>  { return uid != layer.uid })
            }
            setMapLayerVisibility(layer, checked, "check")
        }
        setLayerVisibility(layerVis)
    }
    
    function resetMapLayerVisibility(group, componentType) {
        let layers = defaultVisibility[group]
        let layerVis = {...layerVisibility}
        layers.forEach((layer) => {
            layer.layer.visible = layer.visible
            let layerUid = layer.layer.uid
            if (layerVis[group].includes(layerUid)) {
                if (!layer.visible) {
                    layerVis[group] = layerVis[group].filter((uid) =>  { return uid != layerUid })
                }
            }
            
            if (layer.layers) {
                layer.layer.allSublayers.forEach((sublayer) => {
                    let sl = layer.layers.find((l) => l.serviceId == sublayer.id)
                    if (sl && sublayer.visible != sl.visible) {
                        sublayer.visible = sl.visible
                    }
                    
                    if (layerVis[group].includes(sublayer.uid)) {
                        if (!sl.visible) {
                            layerVis[group] = layerVis[group].filter((uid) =>  { return uid != sublayer.uid })
                        }
                    }
                    
                })
            }
        })
        setLayerVisibility(layerVis)
        shiftMapRandom()
    }
    
    function setMapLayerVisibility(node, visible, componentType) {
        if (node.parent) {
            console.log(node);
            console.log(mapServices);
            let parent = mapServices.find((service) => { 
                return service.layer.id == node.parent
            })
            parent.layer.visible = true
            if (componentType == "radio") {
                parent.layer.allSublayers.forEach((sublayer) => {
                    if (sublayer.sourceJSON.type === "Group Layer") {
                        sublayer.visible = true
                    } else {
                        sublayer.visible = (sublayer.id == node.id) ? visible : false
                    }
                })
            } else {
                parent.layer.allSublayers.forEach((sublayer) => {
                    if (sublayer.sourceJSON.type === "Group Layer") {
                        sublayer.visible = true
                    } else {
                        if ((sublayer.id == node.id) {
                            sublayer.visible = visible
                        }
                    }
                    
                })
            }
            parent.layer.refresh()
        } else {
            let mapLayer = mapServices.find((service) => { 
                return service.layer.uid == node.uid
            })
            mapLayer.layer.visible = visible
        }
        
        // hack to get view to refresh sublayer visibility in map image services
        shiftMapRandom()
    }
    
    function shiftMapRandom() {
        let distance = 10
        let viewCenter = view.center;
        let pt = new Point({
            x:viewCenter.x + randomNumber(-1*distance,distance),
            y:viewCenter.y + randomNumber(-1*distance,distance),
            spatialReference: viewCenter.spatialReference
        })
        view.center = pt
    }
    
    function randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function queryStringToJSON(s) {
        var pairs = s.split('&');
        var result = {};
        pairs.forEach(function(pair) {
            const [k, v] = pair.split('=');
            let value = (["true","false"].includes(v.trim().toLowerCase())) ? (v.trim().toLowerCase() === "true") : v.trim().toLowerCase()
            result[k] = value;
        });

        return JSON.parse(JSON.stringify(result));
    }
    
    function sectionTreeRecursive(data) {
        let group = data.group
        let layers = data.layers
        let componentType = data.componentType
        return (
            <Container className="p-0 m-0" id={"container-"+group}>
               {
                   layers.map((nodes) => {
                        return <TreeComponentRecursive 
                                   data={nodes} 
                                   componentType={componentType}
                                   layerVisibility={layerVisibility}
                                   onInputCheckedChange={onInputCheckedChange}
                                   view={view}
                                   mapServices={mapServices}
                                   mapScale={mapScale}
                                   legendData={legendData}
                                   layerLoading={layerLoading}
                                   isSubLayerVisibleRecursive={isSubLayerVisibleRecursive}
                               />
                    })
                }
            </Container>
        )
    }
    
    async function activeViewChangeHandler(jmv: JimuMapView) {
        if (jmv) {
            await jmv.whenAllJimuLayerViewLoaded()
            setView(jmv.view);
            setMapServices(jmv.getAllJimuLayerViews())
        }
    }
    
    return (
        <Container className="layer-control-widget jimu-widget summary d-flex flex-column h-100 p-0 m-0 bg-white overflow-auto">
            <div style={{padding:"2px 4px"}}>
                <CollapsablePanel 
                    id="layer-control-pane"
                    label={
                        <div style={{padding:"5px 10px 8px 10px"}}>
                            <LayerOutlined />
                            <span style={{position:"relative", marginLeft:"10px", top:"3px", fontSize:"16px"}}>WUI Data Explorer</span>
                        </div>
                    }
                    type="default"
                    defaultIsOpen={false}
                    style={{ padding:"0px 10px" }}
                    isOpen={isOpen}
                    onRequestClose={() => { setIsOpen(false); }}
                    onRequestOpen={() => { setIsOpen(true); sendWidgetMessages() }}
                >
                {widgetLoading &&
                    <Container className="d-flex flex-row align-items-center justify-content-center flex-grow-1 p-0 m-0 position-relative">
                            <div style={{ height: "100px" }}>
                                &nbsp;
                                <Loading
                                    type="SECONDARY"
                                    width={20}
                                    height={20}
                                />
                            </div>
                    </Container>
                }
                {!widgetLoading && mapLayers && (
                        Object.values(mapLayers).reverse().map((section) => {
                            return (
                                <Container className="layer-control-section p-0 pt-4 pb-4 m-0">
                                    <div className="d-flex m-0 p-0 flex-row">
                                        <div 
                                            className="mb-1 font-weight-bold" 
                                            style={{ fontSize:"16px" }}
                                        >
                                            {section.title}
                                        </div>
                                        <div
                                            style={{ textAlign:"right", flexGrow:1 }}
                                        >
                                            <Tooltip 
                                                placement="right"
                                                title="Click to reset to the default layer visibility."
                                                showArrow
                                            >
                                                <Button 
                                                    size="sm" 
                                                    icon
                                                    onClick={(e) => {
                                                        resetMapLayerVisibility(section.group, section.componentType)
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faArrowRotateLeft} size="m" style={{ color: "#050505"}}/>
                                                    
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    {sectionTreeRecursive(section)}
                                </Container>
                            )
                        })
                    )
                }
                
                <div className="jimu-widget">
                    {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
                        <JimuMapViewComponent
                            useMapWidgetId={props.useMapWidgetIds?.[0]}
                            onActiveViewChange={activeViewChangeHandler}
                        />
                    )}
                </div>
            </div>
        </Container>
    );
    
};
