import React, { useState, useEffect } from "react";
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { SettingSection, SettingRow, SidePopper, MapWidgetSelector } from 'jimu-ui/advanced/setting-components';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { Label, Select, Option, MultiSelect, Switch } from 'jimu-ui';
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { type IMConfig } from '../config'
import '../runtime/lib/style.css'

import { Immutable, DataSourceManager, type UseDataSource, type DataSource, AllDataSourceTypes, dataSourceUtils, type IMFieldSchema } from 'jimu-core'


export default function Setting (props:AllWidgetSettingProps) {
    const [useMapWidgetIds, setUseMapWidgetIds] = useState(props.useMapWidgetIds);
    
    const [useDataSources, setUseDataSources] = useState<UseDataSource[]>();
    const supportedDsTypes = Immutable([AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene])
    
    const [checked, setChecked] = useState<boolean>(true);
    
    function onSelectMapWidget(useMapWidgetIds){
        props.onSettingChange({
            id: props.id,
            useMapWidgetIds: useMapWidgetIds
        })
        setUseMapWidgetIds(useMapWidgetIds)
    }
    
    useEffect(() => {
        props.onSettingChange({
            id: props.id,
            useDataSources: useDataSources
        })
        console.log(useDataSources)
    },[useDataSources])
    
    useEffect(() => {
        props.onSettingChange({
            id: props.id,
            config: {
                ...props.config,
                includeSwipeCompare: checked
            }
        })
    },[checked])
    
    function dataSourceChange(ds: UseDataSource[]) {
        console.log(ds)
        // Use propsUseDataSources instead of this.props.useDataSources because this.props.useDataSources maybe undefined.
        let propsUseDataSources: Immutable.ImmutableArray<UseDataSource> = props.useDataSources

        if (!propsUseDataSources) {
          // There is no data source by default, so this.props.useDataSources is undefined by default.
          // So it means user doesn't select any webmap/webscene data source if propsUseDataSources is empty.
          propsUseDataSources = Immutable([])
        }

        if ((useDataSources && useDataSources.length > propsUseDataSources.length) || !useDataSources) {
            // select new webmap/webscene data source
            
            let tempUseDataSources = []
            tempUseDataSources = Object.assign(tempUseDataSources, propsUseDataSources)
            
            let newSelectedDs = null
            if (useDataSources) {
                newSelectedDs = useDataSources.find(ds => !propsUseDataSources.some(uDs => uDs.dataSourceId === ds.dataSourceId))
            } else {
                newSelectedDs = ds[0]
            }
            tempUseDataSources.push(newSelectedDs)
            
            setUseDataSources(Immutable(tempUseDataSources))
        } else if (useDataSources.length < propsUseDataSources.length) {
            // unselect webmap/webscene data source
            const currentRemovedDs = propsUseDataSources.find(uDs => !useDataSources.some(ds => uDs.dataSourceId === ds.dataSourceId))
            const removedDatasourceId = currentRemovedDs.dataSourceId
            // remove related useDataSource
            let tempUseDataSources = []
            tempUseDataSources = Object.assign(tempUseDataSources, propsUseDataSources)
            for (let i = 0; i < tempUseDataSources.length; i++) {
              if (tempUseDataSources[i].dataSourceId === removedDatasourceId) {
                tempUseDataSources.splice(i, 1)
                break
              }
            }
            setUseDataSources(Immutable(tempUseDataSources))
        }
    }
    
    useEffect(() => {
        console.log(useMapWidgetIds)
    }, [useMapWidgetIds])
    
    return (
        <div className="layer-control-setting">
            <SettingSection>
                <SettingRow>
                    <div style={{ marginTop: "20px" }}>
                        <Label style={{ fontSize: "16px" }}>Select Web Map:</Label>
                        <MapWidgetSelector
                            onSelect={(useMapWidgetIds) => onSelectMapWidget(useMapWidgetIds)}
                            useMapWidgetIds={useMapWidgetIds}
                            className="mt-0"
                        />
                    </div>
                </SettingRow>

                <SettingRow>
                    <DataSourceSelector
                        widgetId={props.id}
                        isMultiple={true}
                        types={supportedDsTypes}
                        buttonLabel={"Select Map"}
                        useDataSources={useDataSources}
                        mustUseDataSource
                        onChange={dataSourceChange}
                        hideAddDataButton={true}
                        hideTypeDropdown={true}
                    />
                </SettingRow>
                
                <SettingRow>
                    <Label style={{ fontSize: "14px" }}>
                        <span>Include Swipe</span>
                        <Switch
                          aria-label="Switch"
                          checked
                          className="ml-2"
                          checked={checked}
                          onChange={() => {
                            setChecked(!checked);
                          }}
                        />
                </SettingRow>
                
            </SettingSection>
        </div>
    )

}
