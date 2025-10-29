import React, { useState, useEffect, useRef } from "react";

import { type AllWidgetProps, getAppStore, appActions, MutableStoreManager, ReactRedux, type WidgetProps, WidgetManager, type IMState, WidgetState, DataSourceComponent, DataSourceManager, dataSourceUtil  } from 'jimu-core'
const { useSelector, useDispatch } = ReactRedux
import { JimuMapViewComponent, JimuMapView, MapViewManager } from "jimu-arcgis";
import MapView from 'esri/views/MapView'
import type WebMap from 'esri/WebMap'
import { 
    Container, 
    Row, 
    Button, 
    AdvancedButtonGroup,
    Label, 
    Loading, 
    CollapsablePanel, 
    CollapsableCheckbox, 
    CollapsableRadio, 
    Tooltip, 
    Radio,
    Switch,
    Select,
    Option,
    Checkbox
} from "jimu-ui";

import { LayerOutlined } from 'jimu-icons/outlined/gis/layer'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { WidgetSwipeOutlined } from 'jimu-icons/outlined/brand/widget-swipe'
import { MergeLayersOutlined } from 'jimu-icons/outlined/gis/merge-layers'
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus'
import { CloseOutlined } from 'jimu-icons/outlined/editor/close'
import { ArrowUpDownOutlined } from 'jimu-icons/outlined/directional/arrow-up-down'
import { FeatureLayerViewOutlined } from 'jimu-icons/outlined/gis/feature-layer-view'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFolderOpen, faCircleDown } from '@fortawesome/free-regular-svg-icons'
import { faArrowRotateLeft, faBars, faHouseUser } from '@fortawesome/free-solid-svg-icons'

import Color from "@arcgis/core/Color.js";
import Swipe from "@arcgis/core/widgets/Swipe.js";
import reactiveUtils from "esri/core/reactiveUtils";

import { type IMConfig } from '../config'
import './lib/style.css'


export default function (props: AllWidgetProps<IMConfig>) {
    const [widgetLoading, setWidgetLoading] = useState(true);
    const [layerLoading, setLayerLoading] = useState(false);
    
    const [dataSource, setDataSource] = useState(null);
    const [view, setView] = useState(null);
    const [view2, setView2] = useState(null);
    const [map, setMap] = useState(null);
    const [map2, setMap2] = useState(null);
    const [mapLayers, setMapLayers] = useState(null);
    const [map2Layers, setMap2Layers] = useState(null);
    
    const [year, setYear] = useState('2010 - 2020')
    const [scale, setScale] = useState('Block')
    const [mapType, setMapType] = useState('bivariate')
    const [prevMapType, setPrevMapType] = useState('bivariate')
    
    const [selectMetrics, setSelectMetrics] = useState(null)
    const [selectedMetric, setSelectedMetric] = useState(null)
    const [selectedVariable, setSelectedVariable] = useState(null)
    
    const [wuiChecked, setWuiChecked] = useState(false)
    const [serviceLineChecked, setServiceLineChecked] = useState(false)
    
    const [activeLayer, setActiveLayer] = useState(null);
    const [layerLegend, setLayerLegend] = useState(null);
    
    const [countyBoundaries, setCountyBoundaries] = useState(null);
    
    const [activeCompare, setActiveCompare] = useState(false);
    const [swipeWidget, setSwipeWidget] = useState(null);
    const [swipeWidgetPositionOffset, setSwipeWidgetPositionOffset] = useState(1);
    
    const [swipeLeadingLayers, setSwipeLeadingLayers] = useState([]);
    const [swipeTrailingLayers, setSwipeTrailingLayers] = useState([]);
    const [swipeLeadingLayerTitle, setSwipeLeadingLayerTitle] = useState(null);
    const [swipeTrailingLayerTitle, setSwipeTrailingLayerTitle] = useState(null);
    const [swipeLeadingLayersActive, setSwipeLeadingLayersActive] = useState(false);
    const [swipeTrailingLayersActive, setSwipeTrailingLayersActive] = useState(false);
    
    const [swipeLeadingLayersSettings, setSwipeLeadingLayersSettings] = useState({
        layer: null,
        variable: null,
        metric: null,
        year: '2010 - 2020',
        scale: 'Block',
        mapType: 'bivariate'
    });
    const [swipeTrailingLayersSettings, setSwipeTrailingLayersSettings] = useState({
        layer: null,
        variable: null,
        metric: null,
        year: '2010 - 2020',
        scale: 'Block',
        mapType: 'bivariate'
    });
    const [compareLayerElementClicked, setCompareLayerElementClicked] = useState(null);
    
    const [sideBySideMapId, setSideBySideMapId] = useState(null)
    const [sideBySidePanelId, setSideBySidePanelId] = useState(null)
    
    const [swipeActive, setSwipeActive] = useState(false)
    const [sideBySideActive, setSideBySideActive] = useState(false)
    
    const [isOpen, setIsOpen] = useState(true)
    
    const [wuiVulnerabilityWidgetId, setWuiVulnerabilityWidgetId] = useState(null)
    const [wuiDataExplorerWidgetId, setWuiDataExplorerWidgetId] = useState(null)
    const [wuiGrowthWidgetId, setWuiGrowthWidgetId] = useState(null)
    
    const [includeSwipeCompare, setIncludeSwipeCompare] = useState(true)
    const [hideSwipeCompare, setHideSwipeCompare] = useState(false)
    
    const [isMainMapPanel, setIsMainMapPanel] = useState(true)
    
    let tooltips = {
        'Housing': {
            '1990 - 2000': 'Percent change in housing density from year 1990 to 2000',
            '2000 - 2010': 'Percent change in housing density from year 2000 to 2010',
            '2010 - 2020': 'Percent change in housing density from year 2010 to 2020'
        },
        'Population': {
            '1990 - 2000': 'Percent change in population from year 1990 to 2000',
            '2000 - 2010': 'Percent change in population from year 2000 to 2010',
            '2010 - 2020': 'Percent change in population from year 2010 to 2020'
        },
        'Young': {
            '1990 - 2000': 'Percent change in population aged 18 to 34 from year 1990 to 2000',
            '2000 - 2010': 'Percent change in population aged 18 to 34 from year 2000 to 2010',
            '2010 - 2020': 'Percent change in population aged 18 to 34 from year 2010 to 2020'
        },
        'Older': {
            '1990 - 2000': 'Percent change in population aged 65+ from year 1990 to 2000',
            '2000 - 2010': 'Percent change in population aged 65+ from year 2000 to 2010',
            '2010 - 2020': 'Percent change in population aged 65+ from year 2010 to 2020'
        },
        'Hispanic': {
            '1990 - 2000': 'Percent change in percent of population that is hispanic from year 1990 to 2000',
            '2000 - 2010': 'Percent change in percent of population that is hispanic from year 2000 to 2010',
            '2010 - 2020': 'Percent change in percent of population that is hispanic from year 2010 to 2020'
        },
        'Renter': {
            '1990 - 2000': 'Percent change in renting households from year 1990 to 2000',
            '2000 - 2010': 'Percent change in renting households from year 2000 to 2010',
            '2010 - 2020': 'Percent change in renting households from year 2010 to 2020'
        },
        'Price': {
            '1990 - 2000': 'Median sale price per living space square footage from year 1988 to 1992',
            '2000 - 2010': 'Median sale price per living space square footage from year 1998 to 2002',
            '2010 - 2020': 'Median sale price per living space square footage from year 2008 to 2022'
        },
        'Built': {
            '1990 - 2000': 'Median year built',
            '2000 - 2010': 'Median year built',
            '2010 - 2020': 'Median year built'
        },
        'Change in Young': {
            '1990 - 2000': 'Percent change in percent of population that is hispanic from year 1990 to 2000',
            '2000 - 2010': 'Percent change in percent of population that is hispanic from year 2000 to 2010',
            '2010 - 2020': 'Percent change in percent of population that is hispanic from year 2010 to 2020'
        },
        'Change in Hispanic': {
            '1990 - 2000': 'Percent change in percent of population that is hispanic from year 1990 to 2000',
            '2000 - 2010': 'Percent change in percent of population that is hispanic from year 2000 to 2010',
            '2010 - 2020': 'Percent change in percent of population that is hispanic from year 2010 to 2020'
        },
        'Change in Renter': {
            '1990 - 2000': 'Percent change in percent of population that is hispanic from year 1990 to 2000',
            '2000 - 2010': 'Percent change in percent of population that is hispanic from year 2000 to 2010',
            '2010 - 2020': 'Percent change in percent of population that is hispanic from year 2010 to 2020'
        },
    }
    
    
    const metrics = [
        { id:'Housing' , label:'Housing Density', bivariate: true },
        { id:'Population' , label:'Population', bivariate: true },
        { id:'Young' , label:'Young Adult Population', bivariate: true },
        { id:'Older' , label:'Older Adult Population', bivariate: true },
        { id:'Hispanic' , label:'Hispanic Population', bivariate: true },
        { id:'Renter' , label:'Renter Household', bivariate: true },
        //{ id:'Change in Young' , label:'Change in Young Adults', bivariate: false },
        //{ id:'Change in Hispanic' , label:'Change in Hispanic Population', bivariate: false },
        //{ id:'Change in Renter' , label:'Change in Renter Household', bivariate: false },
    ]
    
    const variables = [
        { id:'Price' , label:'Median Sales Price'},
        { id:'Built' , label:'Median Year Built'},
    ]
    
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
        setHideSwipeCompare(sideBySidePanelCollapse);
        if (sideBySidePanelCollapse) {
            setActiveCompare(false);
            if (!isMainMapPanel) {
                setIsOpen(false);
                resetWidget();
            }
        }
    }, [sideBySidePanelCollapse, dispatch])
    
    const toggleMapSidebarWidget = (openState) => {
        if (widgetState && Object.hasOwn(widgetState,"collapse") {
            let collapseState = widgetState.collapse;
            getAppStore().dispatch(appActions.widgetStatePropChange(sideBySidePanelId, "collapse", openState));
        }
    };
    
    const sendWidgetMessages = () => {
        getAppStore().dispatch(appActions.widgetStatePropChange(wuiVulnerabilityWidgetId, "activeWidgetId", Math.random()));
        getAppStore().dispatch(appActions.widgetStatePropChange(wuiDataExplorerWidgetId, "activeWidgetId", Math.random()));
    }
    
    useEffect(() => {
        if (props) {
            //console.log(props);
            let appConfig = getAppStore().getState().appConfig;
            let widgets = Object.values(appConfig.widgets);
            
            let currentWidgetType = props.label.split('-').pop();
            setIsMainMapPanel(currentWidgetType == 'main');
            
            let mapWidget = widgets.find(w => w.label == 'Map 2')
            if (mapWidget) {
                setSideBySideMapId(mapWidget.id);
            }
            
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
            
            if (props.config.hasOwnProperty('includeSwipeCompare')) {
                setIncludeSwipeCompare(props.config.includeSwipeCompare);
            }
            
        }
    }, [props])
    
    useEffect(() => {
        if (props.stateProps) {
            if (isOpen) {
                setIsOpen(false);
                resetWidget();
            }
        }
    }, [props.stateProps])
    
    useEffect(() => {
        if (dataSource && sideBySideMapId) {
            let mvManager = MapViewManager.getInstance()
            mvManager.createJimuMapView({
                mapWidgetId: sideBySideMapId,
                view: new MapView({map: dataSource.map}),
                dataSourceId: dataSource.id,
                isActive: true,
                mapViewManager: mvManager
            }).then(jimuMapView => {
                setView2(jimuMapView.view);
            })
            
        }
    }, [dataSource, sideBySideMapId])
    
    useEffect(() => {
        if (view) {
            setMap(view.map);
            reactiveUtils.when(
                () => !view.updating,
                () => {
                    setLayerLoading(false);
                }
            )
        }
    }, [view])
    
    useEffect(() => {
        if (map) {
            setMapLayers(map.allLayers.items)
        }
    }, [map])
    
    useEffect(() => {
        if (mapLayers) {
            setWidgetLoading(false);
            
            let county = mapLayers.find((l) => { return l.title.includes('County') })
            setCountyBoundaries(county)
        }
    }, [mapLayers])
    
    useEffect(() => {
        if (view2) {
            setMap2(view2.map)
        }
    }, [view2])
    
    useEffect(() => {
        if (map2) {
            setMap2Layers(map2.allLayers.items)
        }
    }, [map2])
    
    useEffect(() => {
        if (activeLayer) {
            let legendNode = null
            if (mapType == "bivariate") {
                legendNode = createBivariateLegend(activeLayer);
            } else if (mapType == "univariate") {
                legendNode = createUnivariateLegend(activeLayer);
            }
            setLayerLegend(legendNode)
        }
    }, [activeLayer])
    
    useEffect(() => {
        if (mapLayers) {
            toggleReferenceLayers("Non-WUI", wuiChecked)
        }
    }, [wuiChecked])
    
    useEffect(() => {
        if (mapLayers) {
            toggleReferenceLayers("Service Line", serviceLineChecked)
        }
    }, [serviceLineChecked])
    
    function toggleReferenceLayers(titleElement, visible) {
        let groupReference = mapLayers.find((l) => { return l.type == "group" && l.title.includes("Reference") })
        let layers = groupReference.allLayers.items.filter((l) => { return l.title.includes(titleElement) })
        layers.forEach((layer) => {
            layer.visible = visible;
        })
    }
    
    function resetWidget() {
        clearLayersFromCompare();
        setSwipeActive(false);
        setSideBySideActive(false);
        //toggleMapSidebarWidget(false);
        if (swipeWidget) {
            swipeWidget.destroy();
        }
        setActiveCompare(false);
        
        setSelectedMetric(null);
        setSelectedVariable(null);
        if (activeLayer) {
            activeLayer.visible = false;
            setActiveLayer(null);
        }
        setYear('2010 - 2020');
        setScale('Block');
        setMapType('bivariate');
        setPrevMapType('bivariate');
        
        setWuiChecked(false);
        setServiceLineChecked(false);
    }
    
    function createUnivariateLegend(layer) {
        let renderer = layer.renderer
        
        let colors = []
        let labels = []
        let infos = renderer.classBreakInfos
        infos.forEach((v) => {
            let f = v.symbol.data.symbol.symbolLayers.find(l => l.type == 'CIMSolidFill')
            let color = new Color(f.color.slice(0,4)).toHex()
            colors.unshift(color)
            labels.unshift(v.label)
        })
        
        let title = selectedMetric ? metrics.find(m => m.id == selectedMetric).label : ""
        
        let symbolNode = (
            <div className="d-flex flex-row justify-content-center pt-2 pb-2"
                style={{ width: "185px" }}
            >
                <div 
                    style={{
                        display:"flex" 
                        width: "20px", 
                        height: "90px",
                        marginRight: "5px",
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
                                width: "110px", 
                                height: "100px",
                                position: "relative",
                                top: "5px",
                            }}
                        >
                        {title}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center">
                    {
                        colors.map((color,i) => {
                            let labelStyle = {
                                width: "auto", 
                                height: "20px",
                                lineHeight: "20px",
                                position: "relative",
                                top: "0px",
                                textAlign: "left",
                                fontSize: "12px"
                            }
                            let symbolStyle = {
                                width: "20px",
                                height: "20px",
                                backgroundColor: color
                            }
                            return <div className="w-100 d-flex flex-row">
                                       <div className="mt-0 d-flex align-items-center justify-content-center" style={symbolStyle}></div>
                                       <div className="mt-0 ml-2" style={labelStyle}>
                                            {labels[i]}
                                       </div>
                                   </div>
                        })
                    }
                </div>
            </div>
        )
        return symbolNode
    
    }
    
    function createBivariateLegend(layer) {
        let renderer = layer.renderer
        
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
    
    useEffect(() => {
        if (activeCompare) {
            createSwipeWidget()
        } else {
            clearLayersFromCompare()
        }
    }, [activeCompare])
    
    useEffect(() => {
        if (activeCompare) {
            if (swipeActive && swipeWidget) {
                swipeWidget.leadingLayers.forEach((l) => { l.visible = false })
                swipeWidget.trailingLayers.forEach((l) => { l.visible = false })
                
                swipeWidget.leadingLayers = swipeLeadingLayers
                swipeWidget.trailingLayers = swipeTrailingLayers
                
                swipeWidget.leadingLayers.forEach((l) => { l.visible = true })
                swipeWidget.trailingLayers.forEach((l) => { l.visible = true })
                
                refreshSwipeWidget()
            }
            
            if (sideBySideActive) {
                let leadingLayerIds = swipeLeadingLayers.map((l) => { return l.id })
                console.log(leadingLayerIds)
                mapLayers.forEach((l) => {
                    if (l.type == 'feature') {
                        l.visible = leadingLayerIds.includes(l.id)
                    }
                })
                
                let trailingLayerIds = swipeTrailingLayers.map((l) => { return l.id })
                console.log(trailingLayerIds)
                map2Layers.forEach((l) => {
                    if (l.type == 'feature') {
                        l.visible = trailingLayerIds.includes(l.id)
                    }
                })
            }
        }
    }, [activeCompare, swipeLeadingLayers, swipeTrailingLayers, swipeActive, sideBySideActive])
    
    useEffect(() => {
        if (compareLayerElementClicked == null) {
            //if (activeCompare && activeLayer && swipeLeadingLayers.length > 1 && swipeTrailingLayers.length > 1) {
            if (activeCompare && activeLayer) {
                if (swipeLeadingLayersActive) {
                    addActiveLayerToCompare("leading")
                }
                
                if (swipeTrailingLayersActive) {
                    addActiveLayerToCompare("trailing")
                }
            }
        } else {
            let settings = compareLayerElementClicked == "leading" ? swipeLeadingLayersSettings : swipeTrailingLayersSettings;
            setMapType(settings.mapType);
            setScale(settings.scale);
            setYear(settings.year);
            setSelectedVariable(settings.variable);
            setSelectedMetric(settings.metric);
            setActiveLayer(settings.layer);
        }
    }, [activeCompare, swipeLeadingLayersActive, swipeTrailingLayersActive, activeLayer, compareLayerElementClicked])
    
    function addActiveLayerToCompare(position) {
        if (activeLayer) {
            if (position == "leading") {
                let layer = mapLayers.find((l) => { return l.id == activeLayer.id })
                setSwipeLeadingLayers([countyBoundaries, layer])
                setSwipeLeadingLayerTitle(layer.title)
                updateActiveLayerForCompareSettings("leading");
                if (swipeTrailingLayers.length == 0 || !swipeTrailingLayerTitle) {
                    setSwipeTrailingLayers([countyBoundaries])
                }
            }
            
            if (position == "trailing") {
                let layer = mapLayers.find((l) => { return l.id == activeLayer.id })
                setSwipeTrailingLayers([countyBoundaries, layer])
                setSwipeTrailingLayerTitle(layer.title)
                updateActiveLayerForCompareSettings("trailing");
                if (swipeLeadingLayers.length == 0 || !swipeLeadingLayerTitle) {
                    setSwipeLeadingLayers([countyBoundaries])
                }
            }
        }
    }
    
    function removeActiveLayerFromCompare(position) {
        if (activeCompare) {
            if (position == "leading") {
                swipeWidget.leadingLayers.forEach((l) => { l.visible = false })
                setSwipeLeadingLayers([countyBoundaries])
                setSwipeLeadingLayerTitle(null);
                updateActiveLayerForCompareSettings("leading", true);
            }
            
            if (position == "trailing") {
                swipeWidget.trailingLayers.forEach((l) => { l.visible = false })
                setSwipeTrailingLayers([countyBoundaries])
                setSwipeTrailingLayerTitle(null);
                updateActiveLayerForCompareSettings("trailing", true);
            }
        }
    }
    
    function updateActiveLayerForCompareSettings(position, clear=false) {
        let settings = {
            layer: clear ? null : activeLayer,
            variable: clear ? null : selectedVariable,
            metric: clear ? null : selectedMetric,
            year: clear ? '2010 - 2020' : year,
            scale: clear ? 'Block' : scale,
            mapType: clear ? 'bivariate' : mapType
        };
        if (position == "leading") {
            setSwipeLeadingLayersSettings({...settings});
        }
        
        if (position == "trailing") {
            setSwipeTrailingLayersSettings({...settings});
        }
    }
    
    function clearLayersFromCompare() {
        if (swipeActive || sideBySideActive) {
            setSwipeActive(false)
            setSideBySideActive(false)
            
            if (swipeWidget) {
                swipeWidget.destroy();
            }
            setSwipeLeadingLayerTitle(null);
            setSwipeTrailingLayerTitle(null);
            
            let layers = [countyBoundaries]
            let layerIds = layers.map((l) => { return l.id })
            setSwipeLeadingLayers([countyBoundaries])
            setSwipeTrailingLayers([countyBoundaries])
            
            mapLayers.forEach((l) => {
                if (l.type == 'feature') {
                    l.visible = layerIds.includes(l.id)
                }
            })
            
            /*
            map2Layers.forEach((l) => {
                if (l.type == 'feature') {
                    l.visible = layerIds.includes(l.id)
                }
            })
            */
            
            activeLayer.visible = true;
            
            setSwipeLeadingLayersActive(false);
            setSwipeTrailingLayersActive(false);
            
            updateActiveLayerForCompareSettings("leading", true);
            updateActiveLayerForCompareSettings("trailing", true);
        }
    }
    
    function switchLayersForCompare() {
        if (activeCompare && swipeLeadingLayers.length > 0 && swipeTrailingLayers.length > 0) {
            let leading = [...swipeLeadingLayers]
            let trailing = [...swipeTrailingLayers]
            
            let leadingSettings = {...swipeLeadingLayersSettings}
            let trailingSettings  = {...swipeTrailingLayersSettings}
            
            setSwipeLeadingLayers(trailing)
            setSwipeLeadingLayerTitle(trailing[1].title)
            setSwipeLeadingLayersSettings(trailingSettings);
            
            setSwipeTrailingLayers(leading)
            setSwipeTrailingLayerTitle(leading[1].title)
            setSwipeTrailingLayersSettings(leadingSettings);
        }
    }
    
    function createSwipeWidget() {
        if (view) {
            
            let swipe = new Swipe({
                view: view,
                leadingLayers: [],
                trailingLayers: [],
                direction: "horizontal", // swipe widget will move from top to bottom of view
                position: 50, // position set to middle of the view (50%)
                visible: true,
            });
            view.ui.add(swipe);
            setSwipeWidget(swipe);
            
            if (!swipeActive && !sideBySideActive) {
                setSwipeLeadingLayers([countyBoundaries, activeLayer])
                setSwipeTrailingLayers([countyBoundaries])
                
                let layer = mapLayers.find((l) => { return l.id == activeLayer.id })
                setSwipeLeadingLayerTitle(layer.title)
                
                setSwipeActive(true)
                setSideBySideActive(false)
                
                setSwipeLeadingLayersActive(true)
                setSwipeTrailingLayersActive(false)
                
                updateActiveLayerForCompareSettings("leading");
                updateActiveLayerForCompareSettings("trailing", true);
            }
        }
    }
    
    function refreshSwipeWidget() {
        if (activeCompare && swipeWidget) {
            let offset = -1*swipeWidgetPositionOffset
            setSwipeWidgetPositionOffset(offset)
            swipeWidget.position = swipeWidget.position + offset
        }
    }
    
    function openSwipeCompare() {
        setSwipeActive(true)
        setSideBySideActive(false)
        toggleMapSidebarWidget(false)
        createSwipeWidget()
    }
    
    function openSideBySideCompare() {
        setSwipeActive(false)
        setSideBySideActive(true)
        toggleMapSidebarWidget(true)
        if (swipeWidget) {
            swipeWidget.destroy();
        }
    }
    
    useEffect(() => {
        if (compareLayerElementClicked == null) {
            setLayerLegend(null);
            if (prevMapType == mapType) {
                if (year && scale && mapType && mapLayers && (selectedMetric || selectedVariable)) {
                    let groupWuiGrowth = mapLayers.find((l) => { return l.type == "group" && l.title.includes("WUI Growth") })
                    let groupYear = groupWuiGrowth.allLayers.items.find((l) => { return l.type == "group" && l.title.includes(year) })
                    let groupScale = groupYear.allLayers.items.find((l) => { return l.type == "group" && l.title.includes(scale) })
                    if (mapType == 'univariate' && selectedMetric) {
                        let layer = groupScale.allLayers.items.find((l) => { return l.title.startsWith(selectedMetric) && !l.title.includes("&") })
                        if (!activeCompare) {
                            if (layer && activeLayer) {
                                activeLayer.visible = false;
                            }
                            layer.visible = true;
                            setLayerLoading(true);
                        }
                        setActiveLayer(layer)
                        
                    } else if (mapType == 'bivariate' && selectedMetric && selectedVariable) {
                        let layer = groupScale.allLayers.items.find((l) => { return l.title.includes(`${selectedVariable} & ${selectedMetric}`) })
                        if (!activeCompare) {
                            if (layer && activeLayer) {
                                activeLayer.visible = false;
                            }
                            layer.visible = true;
                            setLayerLoading(true);
                        }
                        setActiveLayer(layer)
                    }
                }
            } else {
                setSelectedMetric(null)
                setSelectedVariable(null)
                if (activeLayer) {
                    activeLayer.visible = false;
                    setActiveLayer(null)
                }
                if (mapType) {
                    let options = mapType == 'bivariate' ? metrics.filter((o) => { return o.bivariate }) : metrics;
                    setSelectMetrics(options)
                }
                setPrevMapType(mapType)
            }
        } else {
            setCompareLayerElementClicked(null);
        }
    }, [year,scale,mapType,selectedMetric,selectedVariable])
    
    useEffect(() => {
        let options = mapType == 'bivariate' ? metrics.filter((o) => { return o.bivariate }) : metrics;
        setSelectMetrics(options)
    }, [])
    
    async function activeViewChangeHandlerMap(jmv: JimuMapView) {
        if (jmv) {
            await jmv.whenAllJimuLayerViewLoaded()
            setView(jmv.view);
        }
    }
    
    return (
        <Container className="wui-growth-widget jimu-widget summary d-flex flex-column h-100 p-0 m-0 bg-white overflow-auto">
            <div style={{padding:"2px 4px"}}>
                <CollapsablePanel 
                    id="wui-growth-pane"
                    label={
                        <div style={{padding:"5px 10px 8px 10px"}}>
                            <FontAwesomeIcon 
                                icon={faHouseUser} 
                                size="l"
                                style={{ position:"relative", top:"2px", }}
                            />
                            <span style={{position:"relative", marginLeft:"10px", top:"3px", fontSize:"16px"}}>WUI Growth</span>
                        </div>
                    }
                    type="default"
                    defaultIsOpen={true}
                    isOpen={isOpen}
                    style={{ padding:"0px 10px" }}
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
                {!widgetLoading && (
                        <Container className="control-section p-0 pt-2 pb-2 m-0">
                            <div
                                className='mb-2 pt-2 pb-4'
                            >
                                
                                <div
                                    style={{lineHeight:1.25, fontSize:"14px"}}
                                >
                                Lorem ipsum dolor sit amet. Qui perspiciatis odio quo debitis corporis sit consequatur vitae. Ut maiores corrupti est minus rerum sit aliquid eaque qui dolorum beatae nam consequuntur dolores ad accusamus reprehenderit in assumenda voluptatum. 
                                </div>
                            
                            <div
                                className='mt-4 mb-0 pt-4 pb-4'
                                style={{ borderTop: '1px solid #dddddd'}}
                            >
                                {mapType == 'bivariate' && (
                                    <>
                                    <div className='w-100 d-flex mt-0 mb-1 title2'>
                                        <Tooltip
                                            placement="top-end"
                                            title={ selectedVariable && year ? tooltips[selectedVariable][year] : 'Select a housing variable...' }
                                            showArrow
                                        >
                                            <div style={{ width: "14px" }}>
                                                    <InfoOutlined size={14} />
                                            </div>
                                        </Tooltip>
                                        <div style={{position:"relative", marginLeft:"7px", top:"1px"}}>Housing Variable</div>
                                    </div>
                                    <div className="w-100">
                                        <Select
                                            onChange={(e) => {
                                                //let l = queryLayers.find((ql) => { return ql.id == e.target.value })
                                                setSelectedVariable(e.target.value);
                                            }}
                                            value={selectedVariable}
                                            placeholder="Select a housing variable ..."
                                            className="select"
                                        >
                                            {variables.map((m) => {
                                                return <Option value={m.id} className="option-item">
                                                            {m.label}
                                                       </Option>
                                            })
                                            }
                                        </Select>
                                    </div>
                                    </>
                                )}
                                
                                <div className='w-100 d-flex mt-2 mb-1 title2'>
                                    <Tooltip
                                        placement="top-end"
                                        title={ selectedMetric && year ? tooltips[selectedMetric][year] : 'Select a growth metric...' }
                                        showArrow
                                    >
                                        <div style={{ width: "14px" }}>
                                                <InfoOutlined size={14} />
                                        </div>
                                    </Tooltip>
                                    <div style={{position:"relative", marginLeft:"7px", top:"1px"}}>Growth Metric</div>
                                </div>
                                <div className="w-100">
                                    <Select
                                        onChange={(e) => {
                                            setSelectedMetric(e.target.value);
                                        }}
                                        value={selectedMetric}
                                        placeholder="Select a growth metric ..."
                                        
                                    >
                                        {selectMetrics.map((m) => {
                                                return <Option value={m.id} style={{ color: "#050505" }}>
                                                            {m.label}
                                                       </Option>
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                            
                            {activeLayer && layerLoading && (
                                <div style={{ position: "relative", height: "100px" }}>
                                    &nbsp;
                                    <Loading
                                        type="SECONDARY"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            )}
                            
                            {activeLayer && layerLegend && !layerLoading && (
                                <div
                                    className='mt-0 mb-5'
                                >
                                    <div 
                                        className='d-flex flex-row w-100 mt-0 mb-1 pt-0 pb-1'
                                    >
                                        <div 
                                            className='m-0 title2'
                                            style={{width: "75px"}}
                                        >
                                        </div>
                                        <div
                                            className='m-0'
                                            style={{width: "245px"}}
                                        >
                                            {layerLegend}
                                        </div>
                                    </div>
                                    <div
                                        style={{lineHeight:1.25, fontSize:"14px"}}
                                    >
                                    Lorem ipsum dolor sit amet. Qui perspiciatis odio quo debitis corporis sit consequatur vitae. Ut maiores corrupti est minus rerum sit aliquid. 
                                    </div>
                                    </div>
                                )
                            }
                            
                            
                            <div className='w-100 d-flex mt-2 mb-1 pt-4 title2'
                                style={{ borderTop: '1px solid #dddddd'}}
                            >
                                    <Tooltip
                                        placement="top-end"
                                        title="This can show more information"
                                        showArrow
                                    >
                                        <div style={{ width: "14px" }}>
                                                <InfoOutlined size={14} />
                                        </div>
                                    </Tooltip>
                                    <div style={{position:"relative", marginLeft:"7px", top:"1px"}}>Time Period</div>
                                </div>
                                <AdvancedButtonGroup
                                  size="sm"
                                  variant="contained"
                                  className="w-100"
                                >
                                    <Button
                                        active={year == '1990 - 2000'}
                                        onClick={() => { setYear('1990 - 2000') }}
                                        style={{ width: '33.3%'}}
                                    >
                                        1990-2000
                                    </Button>
                                    <Button
                                        active={year == '2000 - 2010'}
                                        onClick={() => { setYear('2000 - 2010') }}
                                        style={{ width: '33.3%'}}
                                    >
                                        2000-2010
                                    </Button>
                                    <Button
                                        active={year == '2010 - 2020'}
                                        onClick={() => { setYear('2010 - 2020') }}
                                        style={{ width: '33.3%'}}
                                    >
                                        2010-2020
                                    </Button>
                                </AdvancedButtonGroup>
                                
                                <div className='w-100 d-flex mt-2 mb-1 title2'>
                                    <Tooltip
                                        placement="top-end"
                                        title="This can show more information"
                                        showArrow
                                    >
                                        <div style={{ width: "14px" }}>
                                                <InfoOutlined size={14} />
                                        </div>
                                    </Tooltip>
                                    <div style={{position:"relative", marginLeft:"7px", top:"1px"}}>Map Scale</div>
                                </div>
                                <AdvancedButtonGroup
                                  size="sm"
                                  variant="contained"
                                  className="w-100"
                                >
                                    <Button
                                        active={scale == 'Block'}
                                        onClick={() => { setScale('Block') }}
                                        style={{ width: '50%'}}
                                    >
                                        Block Group
                                    </Button>
                                    <Button
                                        active={scale == 'Tract'}
                                        onClick={() => { setScale('Tract') }}
                                        style={{ width: '50%'}}
                                    >
                                        Census Tract
                                    </Button>
                                </AdvancedButtonGroup>
                                
                               
                                <div className='w-100 d-flex mt-2 mb-1 title2'>
                                    <Tooltip
                                        placement="top-end"
                                        title="This can show more information"
                                        showArrow
                                    >
                                        <div style={{ width: "14px" }}>
                                                <InfoOutlined size={14} />
                                        </div>
                                    </Tooltip>
                                    <div style={{position:"relative", marginLeft:"7px", top:"1px"}}>Map Type</div>
                                </div>
                                <AdvancedButtonGroup
                                  size="sm"
                                  variant="contained"
                                  className="w-100"
                                >
                                    <Button
                                        active={mapType == 'univariate'}
                                        onClick={() => { setMapType('univariate') }}
                                        style={{ width: '50%'}}
                                    >
                                        Univariate
                                    </Button>
                                    <Button
                                        active={mapType == 'bivariate'}
                                        onClick={() => { setMapType('bivariate') }}
                                        style={{ width: '50%'}}
                                    >
                                        Bivariate
                                    </Button>
                                </AdvancedButtonGroup>
                            </div>
                            
                            {includeSwipeCompare && !hideSwipeCompare && (
                                <>
                                    <div
                                        className='mt-2 mb-0 pt-4 pb-0'
                                        style={{ borderTop: '1px solid #dddddd'}}
                                    >
                                        <div
                                            className="w-100 d-flex mt-0 title2"
                                        >
                                            <div 
                                                className="d-flex"
                                                style={{ width: '200px'}}
                                            >
                                                <WidgetSwipeOutlined size="m" />
                                                <div style={{position:"relative", marginLeft:"7px", top:"0px"}}>Swipe Compare</div>
                                            </div>
                                            <div 
                                                className="d-flex"
                                                style={{ flexGrow: 1, justifyContent: "flex-end", cursor: "pointer" }}
                                            >
                                                <Switch 
                                                    className="swipe-switch"
                                                    onChange={(e) => {
                                                        setActiveCompare(!activeCompare);
                                                    }}
                                                    checked={activeCompare}
                                                    disabled={!activeCompare && !activeLayer}
                                                />
                                            </div>
                                            
                                        </div>
                                        
                                        {activeCompare && (
                                            <div className="w-100 mt-0 mb-6">
                                                <div
                                                    id="compare-growth-layers"
                                                    className="w-100 mt-0 d-flex mb-2"
                                                >
                                                    
                                                    <div 
                                                        className="d-flex align-items-center"
                                                        style={{ width: "24px" }}
                                                    >
                                                        <ArrowUpDownOutlined 
                                                            size="m" 
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                switchLayersForCompare()
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ flexGrow: 1}}>
                                                        <div 
                                                            className={`d-flex mt-2 compare-layer ${swipeLeadingLayersActive ? "compare-layer-active" : ""}`}
                                                            style={{ height: "40px", cursor: "pointer" }}
                                                            onClick={() => {
                                                                setSwipeLeadingLayersActive(true);
                                                                setSwipeTrailingLayersActive(false);
                                                                setCompareLayerElementClicked("leading");
                                                            }}
                                                        >
                                                            <div 
                                                                className="d-flex align-items-center pl-2" 
                                                                style={{ flexGrow: 1, borderRight: "1px solid #dddddd" }}
                                                            >
                                                                { swipeLeadingLayerTitle 
                                                                    ? swipeLeadingLayerTitle 
                                                                    : (
                                                                    <span style={{ color: "rgb(112,112,112)"}}>
                                                                        Click to add a layer to left map ...
                                                                    </span>)
                                                                }
                                                            </div>
                                                            {swipeLeadingLayerTitle
                                                                ? <div 
                                                                    className="d-flex justify-content-center align-items-center" 
                                                                    style={{ width: "32px", cursor: "pointer"}}
                                                                    onClick={() => {
                                                                        removeActiveLayerFromCompare("leading");
                                                                    }}
                                                                  >
                                                                    <CloseOutlined size="s"/>
                                                                  </div>
                                                                : <div 
                                                                    className="d-flex justify-content-center align-items-center" 
                                                                    style={{ width: "32px", cursor: "pointer"}}
                                                                    onClick={() => {
                                                                        addActiveLayerToCompare("leading");
                                                                    }}
                                                                  >
                                                                    <FeatureLayerViewOutlined size="m"/>
                                                                  </div>
                                                            }
                                                        </div>
                                                        <div 
                                                            className={`d-flex mt-2 compare-layer ${swipeTrailingLayersActive ? "compare-layer-active" : ""}`}
                                                            style={{ height: "40px", cursor: "pointer" }}
                                                            onClick={() => {
                                                                setSwipeLeadingLayersActive(false);
                                                                setSwipeTrailingLayersActive(true);
                                                                setCompareLayerElementClicked("trailing");
                                                            }}
                                                        >
                                                            <div 
                                                                className="d-flex align-items-center pl-2" 
                                                                style={{ flexGrow: 1, borderRight: "1px solid #dddddd"}}
                                                            >
                                                                { swipeTrailingLayerTitle 
                                                                    ? swipeTrailingLayerTitle 
                                                                    : (<span style={{ color: "rgb(112,112,112)"}}>
                                                                        Click to add a layer to right map ...
                                                                       </span>)
                                                                }
                                                            </div>
                                                            {swipeTrailingLayerTitle
                                                                ? <div 
                                                                    className="d-flex justify-content-center align-items-center" 
                                                                    style={{ width: "32px", cursor: "pointer"}}
                                                                    onClick={() => {
                                                                        removeActiveLayerFromCompare("trailing");
                                                                    }}
                                                                  >
                                                                    <CloseOutlined size="s"/>
                                                                  </div>
                                                                : <div 
                                                                    className="d-flex justify-content-center align-items-center" 
                                                                    style={{ width: "32px", cursor: "pointer"}}
                                                                    onClick={() => {
                                                                        addActiveLayerToCompare("trailing");
                                                                    }}
                                                                  >
                                                                    <FeatureLayerViewOutlined size="m"/>
                                                                  </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4" style={{ justifyContent: "space-evenly", display: "none" }}>
                                                    <Button
                                                        className={`${swipeActive ? "compare-active" : ""}`}
                                                        color="default"
                                                        size="sm"
                                                        variant="text"
                                                        onClick={() => { 
                                                            openSwipeCompare()
                                                        }}
                                                        style={{
                                                            borderWidth: "0px"
                                                        }}
                                                    >
                                                        <WidgetSwipeOutlined size="s" />
                                                        Swipe
                                                    </Button>
                                                    <Button
                                                        className={`${sideBySideActive ? "compare-active" : ""}`}
                                                        color="default"
                                                        size="sm"
                                                        variant="text"
                                                        onClick={() => {
                                                            openSideBySideCompare()
                                                        }}
                                                        style={{
                                                            borderWidth: "0px"
                                                        }}
                                                    >
                                                        <MergeLayersOutlined size="s" />
                                                        Side by Side
                                                    </Button>
                                                </div>
                                                
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            <div
                                className='mt-3 mb-0 pt-4 pb-0'
                                style={{ borderTop: '1px solid #dddddd'}}
                            >
                                <div
                                    className="w-100 mt-0"
                                >
                                    <Label>
                                        <Checkbox
                                            checked={wuiChecked}
                                            onClick={() => {
                                                setWuiChecked(!wuiChecked)
                                            }}
                                        />
                                            <span style={{ marginLeft: '10px'}}>Show Non-WUI Areas</span>
                                        </Label>
                                    </div>
                                    
                                <div
                                    className="w-100 mt-0"
                                >
                                    <Label>
                                        <Checkbox
                                            checked={serviceLineChecked}
                                            onClick={() => {
                                                setServiceLineChecked(!serviceLineChecked)
                                            }}
                                        />
                                            <span style={{ marginLeft: '10px'}}>Show Urban Service Line</span>
                                    </Label>
                                </div>
                            </div>
                            
                            
                            
                        </Container>
                    )
                }
                <div className="jimu-widget">
                    {props.useMapWidgetIds && props.useMapWidgetIds.length > 0 && (
                        <JimuMapViewComponent
                            useMapWidgetId={props.useMapWidgetIds?.[0]}
                            onActiveViewChange={activeViewChangeHandlerMap}
                        />
                    )}

                </div>
                <div className="jimu-widget">
                    {props.useDataSources && props.useDataSources.length > 0 && (
                        <DataSourceComponent 
                            useDataSource={props.useDataSources?.[0]} 
                            onDataSourceCreated={(ds) => { setDataSource(ds) }}
                        />
                    )}
                </div>
            </div>
        </Container>
    )
}
