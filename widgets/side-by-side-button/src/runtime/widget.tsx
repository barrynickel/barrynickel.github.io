import React, { useState, useEffect, useRef } from "react";

import { type AllWidgetProps, getAppStore, appActions, MutableStoreManager, ReactRedux, type WidgetProps, WidgetManager, type IMState, WidgetState, DataSourceComponent, DataSourceManager, dataSourceUtil  } from 'jimu-core'
const { useSelector, useDispatch } = ReactRedux
import { JimuMapViewComponent, JimuMapView, MapViewManager } from "jimu-arcgis";
import MapView from 'esri/views/MapView'
import type WebMap from 'esri/WebMap'
import { type IMConfig } from '../config'

import CompareIcon from '@mui/icons-material/Compare';

export default function (props: AllWidgetProps<IMConfig>) {
    
    const [sideBySidePanelId, setSideBySidePanelId] = useState(null);
    const [sideBySidePanelOpen, setSideBySidePanelOpen] = useState(false);
    
    const widgetState = useSelector((state: IMState) => {
        let widgetState = null;
        if (sideBySidePanelId) {
            widgetState = state.widgetsState[sideBySidePanelId]
        }
        return widgetState
    })
    
    const toggleMapSidebarWidget = (openState) => {
        if (widgetState && Object.hasOwn(widgetState, "collapse") {
            let collapseState = widgetState.collapse;
            getAppStore().dispatch(appActions.widgetStatePropChange(sideBySidePanelId, "collapse", openState));
        }
    };
    
    useEffect(() => {
        if (props) {
            let appConfig = getAppStore().getState().appConfig;
            let widgets = Object.values(appConfig.widgets);
            let sidebarWidget = widgets.find(w => w.label == 'Side by Side Maps')
            if (sidebarWidget) {
                setSideBySidePanelId(sidebarWidget.id);
            }
        }
    }, [props])
    
    useEffect(() => {
        toggleMapSidebarWidget(sideBySidePanelOpen)
    }, [sideBySidePanelOpen])
    
  return (
    <div 
        className="widget-side-by-side jimu-widget d-flex align-items-center p-4"
        style={{ cursor: "pointer", color:"#FFFFFF" }}
        onClick={() => { setSideBySidePanelOpen(!sideBySidePanelOpen) }}
    >
      <CompareIcon style={{ marginRight: "8px" }}/>
      <span style={{ position: "relative", top: "0px" }}> Side by Side Compare</span>
    </div>
  )
}
