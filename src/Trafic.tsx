import * as React from 'react'
import { CanvasJSChart } from './libs/canvasjs.react'

import './App.css'
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis'

interface IState {
  readonly stationTrafic: IStationDetail[]
  readonly stationSlice: number
  readonly stationReseau: string
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
      stationSlice: 10,
      stationReseau: 'Métro',
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
    .filter(station => station.reseau === this.state.stationReseau)
    .slice(0, this.state.stationSlice)
    .sort((a, b) => a.rang - b.rang)
    .map(station => (
      {label: station.station, y: station.trafic}))

    const options = {
      animationEnabled: true,
      theme: "light1",
      title: { text: "Test" },
      data: [{ type: "column", dataPoints: myData }]
    }

    const myData2 = this.state.stationTrafic.map(station =>
      ({id: '00036', y: station.trafic, x: station.rang })
    )

    return (
      <div>
        <input
          type="number"
          title="Nombre de stations à afficher"
          value={this.state.stationSlice}
          max={300}
          min={1}
          onChange={v => this.setState({stationSlice: Number(v.target.value)}) }
        />
        <button onClick={() => this.setState({stationReseau: 'RER'}) }> RER </button>
        <button onClick={() => this.setState({stationReseau: 'Métro'}) }> Métro </button>
        <CanvasJSChart options={options}/>
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
    )
  }
}

