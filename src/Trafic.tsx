import * as React from 'react'
import { CanvasJSChart } from './libs/canvasjs.react'

import './App.css'
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis'

interface IState {
  readonly stationTrafic: IStationDetail[]
  readonly selectedSlice: number
  readonly selectedReseau: string
}

interface IStationDetail {
  readonly station: string
  readonly trafic: number
  readonly rang: number
  readonly reseau: string
}

export class Trafic extends React.PureComponent<{}, IState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      stationTrafic: [],
      selectedSlice: 10,
      selectedReseau: 'Métro',
    }
  }

  // function called before render to make requests on the external API
  public componentWillMount(): void {
    fetch('https://data.ratp.fr/api/v2/catalog/datasets/trafic-annuel-entrant-par-station-du-reseau-ferre-2017/exports/json').then(
      result => result.json().then(
        (stationTrafic: IStationDetail[]) => this.setState({
          stationTrafic: stationTrafic.map(({ station, rang, trafic, reseau }) => ({ station, rang, trafic, reseau })
          )
        })
      ))
  }

  public render(): JSX.Element {
    const myData = this.state.stationTrafic
    .filter(station => station.reseau === this.state.selectedReseau)
    .slice(0, this.state.selectedSlice)
    .sort((a, b) => a.rang - b.rang)
    .map(station => (
      {label: station.station, y: station.trafic}))

    const options = {
      animationEnabled: true,
      theme: "light1",
      title: { text: "Nombre d'entrées de voyageurs par station en 2017 ( réseau RATP )" },
      data: [{ type: "column", dataPoints: myData }]
    }

    const myData2 = this.state.stationTrafic.map(station =>
      ({id: '00036', y: station.trafic, x: station.rang })
    )

    return (
      <div className="graph-container">
        <div className="first-graph">
          <CanvasJSChart options={options}/>

          <div className="inputs">
            <div>
              <div className="input-title">Selectionnez le nombre de stations à afficher</div>
              <input
                autoFocus={true}
                type="number"
                title="Nombre de stations à afficher"
                value={this.state.selectedSlice}
                max={300}
                min={1}
                onChange={v => this.setState({selectedSlice: Number(v.target.value)}) }
              />
            </div>
            <div className="buttons">
              <div className="input-title">Selectionnez le réseau à afficher</div>
              <button
                className={this.state.selectedReseau === 'RER' ? 'selected-value' : ''}
                onClick={() => this.setState({selectedReseau: 'RER'}) }
              > RER </button>
              <button
                className={this.state.selectedReseau === 'Métro' ? 'selected-value' : ''}
                onClick={() => this.setState({selectedReseau: 'Métro'}) }
              > Métro </button>
            </div>
          </div>
        </div>

        <div className="second-graph">
          <div className="title">
            Graphique de frequentation des stations de metro parisien
          </div>

          <div>
            <XYPlot
              margin={{left: 75}}
              width={1600}
              height={600}
            >
              <VerticalBarSeries className="vertical-bar-series-example" data={myData2} />
              <XAxis />
              <YAxis marginLeft={100}/>
            </XYPlot>
          </div>
          <div className="legende">
            Source RATP 2017
          </div>
        </div>

      </div>
    )
  }
}

