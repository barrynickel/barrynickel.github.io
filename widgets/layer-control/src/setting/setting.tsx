import React, { useState, useEffect } from "react";
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { SettingSection, MapWidgetSelector } from 'jimu-ui/advanced/setting-components';
import { Label, Select, Option, MultiSelect } from 'jimu-ui';
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { type IMConfig } from '../config'
import '../runtime/lib/style.css'


export default function Setting (props:AllWidgetSettingProps) {
    const [useMapWidgetIds, setUseMapWidgetIds] = useState(props.useMapWidgetIds);
    const [radioGroupLayer, setRadioGroupLayer] = useState(props.config.radioGroupLayerId);
    const [groupLayers, setGroupLayers] = useState(null);
    
    function onSelectMapWidget(useMapWidgetIds){
        props.onSettingChange({
            id: props.id,
            useMapWidgetIds: useMapWidgetIds
        })
        setUseMapWidgetIds(useMapWidgetIds)
    }
    
    function onGroupLayerSelected(evt, item, selectedValues) {
        props.onSettingChange({
            id: props.id,
            config: {
                ...props.config,
                radioGroupLayerId: selectedValues
            }
        })
        setRadioGroupLayer(selectedValues)
    }
    
    const activeViewChangeHandler = async (jmv: JimuMapView) => {
        if (jmv) {
            let view = jmv.view
            let map = view.map
            let groups = []
            map.layers.forEach((group) => {
                if (group.type == "group") {
                    groups.push({ label:group.title, value:group.id});
                }
            })
            groups.reverse()
            setGroupLayers(groups)
        }
    }
    
    return (
        <div className="layer-control-setting">
            <SettingSection>
                <div style={{ marginTop: "20px" }}>
                    <Label style={{ fontSize: "16px" }}>Select Web Map:</Label>
                    <MapWidgetSelector
                        onSelect={(useMapWidgetIds) => onSelectMapWidget(useMapWidgetIds)}
                        useMapWidgetIds={useMapWidgetIds}
                        className="mt-0"
                    />
                </div>
                <div style={{ marginTop: "30px" }}>
                    <Label style={{ fontSize: "16px" }}>Select Radio Group:</Label>
                    {groupLayers && (
                        <div className='d-flex flex-column'>
                             <MultiSelect
                                values={radioGroupLayer}
                                onClickItem={onGroupLayerSelected}
                                items={groupLayers}
                                placeholder="Please select some items"
                            ></MultiSelect>
                            
                        </div>
                    )}
                </div>
            </SettingSection>
            <div className="jimu-map-view">
                {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
                    <JimuMapViewComponent
                        useMapWidgetId={props.useMapWidgetIds?.[0]}
                        onActiveViewChange={activeViewChangeHandler}
                    />
                )}
            </div>
        </div>
    )

}
