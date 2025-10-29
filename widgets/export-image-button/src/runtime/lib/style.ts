import { IMThemeVariables, css, SerializedStyles } from 'jimu-core'

export function getStyle (theme: IMThemeVariables): SerializedStyles {
  const bg = theme.surfaces[1].bg

  return css`
    .widget-body {
        align-items: center;
        justify-content: right;
        font-size: 14px;
        background-color: ${bg};
        height: inherit;
        overflow: auto;

        .header-container {
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 0.25rem;
          padding-right: 0.25rem;
          top: 0;
          display: flex;
          justify-content: space-between;
          position: sticky;
          position: -webkit-sticky;
          background-color: ${bg};
          border-bottom: 1px solid gray;

          .header-title {
            font-weight:bold;
          }

          .header-legend {
            padding-left: 5px;
          }
        }
        
        .title2 {
            background-color:#F5F5F5;
        }

        .body-radio-group {
          padding-left: 10px;
          /*height: inherit;*/
          /*overflow: auto;*/
          /*height: calc(100vh - 131px);*/

          .radio-box {
            display: flex;

            .radio-label {
              padding-left: 10px;
            }
          }
        }
    }
  `
}