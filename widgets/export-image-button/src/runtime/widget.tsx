import React, { useState, useEffect, useRef } from "react";

import { type AllWidgetProps, getAppStore, ReactRedux, type WidgetProps, WidgetManager, type IMState, WidgetState  } from 'jimu-core'
const { useSelector } = ReactRedux
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { type IMConfig } from '../config'

import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';

export default function (props: AllWidgetProps<IMConfig>) {
    
    const [view, setView] = useState(null);
    const [view2, setView2] = useState(null);
    const [sideBySidePanelId, setSideBySidePanelId] = useState(null);
    
    const canvasRef = useRef(null)
    
    const widgetState = useSelector((state: IMState) => {
        let widgetState = null;
        if (sideBySidePanelId) {
            widgetState = state.widgetsState[sideBySidePanelId]
        }
        return widgetState
    })
    
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
    
    async function getMapImage() {
        let isOpen = false
        if (widgetState && Object.hasOwn(widgetState,"collapse") {
            isOpen = widgetState.collapse;
        }
        
        const pptRatio = 1024/768;
        let dataUrl = null;
        if (isOpen) {
            const width = 1024/2 //view.height*pptRatio
            const height = 768 //view.height
            
            let viewImageMain = await view.takeScreenshot({
                format: "png",
                width: width,
                height: height
            }));
        
            const imageMain = new Image();
            imageMain.src = viewImageMain.dataUrl;
            await imageMain.decode();
            
            let viewImageSecond = await view2.takeScreenshot({
                format: "png",
                width: width,
                height: height
            }));
        
            const imageSecond  = new Image();
            imageSecond.src = viewImageSecond .dataUrl;
            await imageSecond .decode();
            
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.drawImage(imageMain, 0, 0, width, height);
            context.drawImage(imageSecond, width, 0, width, height);
            
            dataUrl = canvas.toDataURL('image/png');
        } else {
            const width = 1024 //view.height*pptRatio
            const height = 768 //view.height
            
            let viewImageMain = await view.takeScreenshot({
                format: "png",
                width: width,
                height: height
            }));
            dataUrl = viewImageMain.dataUrl;
        }
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = "map.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    }
    
    async function activeViewChangeHandlerMap(jmv: JimuMapView) {
        if (jmv) {
            await jmv.whenAllJimuLayerViewLoaded()
            setView(jmv.view);
        }
    }
    
    async function activeViewChangeHandlerMap2(jmv: JimuMapView) {
        if (jmv) {
            await jmv.whenAllJimuLayerViewLoaded()
            setView2(jmv.view);
        }
    }
    
  return (
      <>
            <div 
                className="widget-export-image jimu-widget d-flex align-items-center p-4"
                style={{ cursor: "pointer", color:"#FFFFFF", overflow: "hidden" }}
                onClick={() => { getMapImage() }}
            >
              <ScreenshotMonitorIcon style={{ marginRight: "8px" }}/>
              <span> Export to Image</span>
              <canvas 
                ref={canvasRef}
                width="1024"
                height="768"
                style={{ position: "absolute", top: "-1000px", left: "-2000px", zIndex: 1000 }}
            />
            </div>
            <div className="jimu-widget">
                {props.useMapWidgetIds && props.useMapWidgetIds.length > 0 && (
                    <JimuMapViewComponent
                        useMapWidgetId={props.useMapWidgetIds?.[0]}
                        onActiveViewChange={activeViewChangeHandlerMap}
                    />
                )}
            </div>
            <div className="jimu-widget">
                {props.useMapWidgetIds && props.useMapWidgetIds.length > 0 && (
                    <JimuMapViewComponent
                        useMapWidgetId={props.useMapWidgetIds?.[1]}
                        onActiveViewChange={activeViewChangeHandlerMap2}
                    />
                )}
            </div>
        </>
    )
}
