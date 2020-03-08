import React, { Component } from 'react';
import { Map as LeafletMap, ScaleControl } from 'react-leaflet';
import mapConfig from './assets/map_config';
import './styles/Map.css';
import MapBoxLayer from './components/MapBoxLayer';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';
import ColorLegend from './components/ColorLegend';
import RecordsModal from './components/RecordsModal';
import GeoJSONLayer from './components/GeoJSONLayer';
import { DIOCESE } from './components/cosyn-constants';

class LocalLegislationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: mapConfig,
      currentColorScheme: 'color1',
      info: null,
      recordsModalOpen: false,
      searchResults: null,
      layerViewMode: DIOCESE,
      showStripedRegions: true,
    };
    this.mapRef = React.createRef();
  }

  showRecordsModal = (searchResults) => {
    this.setState({
      searchResults: searchResults,
      recordsModalOpen: true,
    });
  };

  closeRecordsModal = () => {
    this.setState({ recordsModalOpen: false });
  };

  changeColorScheme = (colorScheme) => {
    this.setState({
      currentColorScheme: colorScheme,
    });
  };

  changeLayerViewMode = (viewMode) => {
    this.setState({
      layerViewMode: viewMode,
    });
  };

  toggleCheckBox = (key, isChecked) => {
    this.setState({
      [key]: isChecked,
    });
  };

  updateInfo = (info) => {
    this.setState({
      info: info,
    });
  };

  getMaxNumEntries = () => {
    const { mappingData } = this.props;
    if (!mappingData) {
      return 0;
    }
    const entries = Object.keys(mappingData).map((key) => {
      return mappingData[key].length;
    });
    return Math.max(...entries);
  };

  render() {
    const config = this.state.config;
    const maxNumEntries = this.getMaxNumEntries();
    return (
      <div>
        <InfoPanel info={this.state.info} />
        <ControlPanel
          changeColorScheme={this.changeColorScheme}
          toggleCheckBox={this.toggleCheckBox}
          changeLayerViewMode={this.changeLayerViewMode}
          layerViewMode={this.state.layerViewMode}
          showStripedRegions={this.state.showStripedRegions}
        />
        <ColorLegend
          mappingData={this.props.mappingData}
          config={config}
          maxNumEntries={maxNumEntries}
          currentColorScheme={this.state.currentColorScheme}
        />
        <RecordsModal
          recordsModalOpen={this.state.recordsModalOpen}
          closeRecordsModal={this.closeRecordsModal}
          searchResults={this.state.searchResults}
        />
        <LeafletMap
          id="mapid"
          ref={this.mapRef}
          center={config.params.center}
          zoom={config.params.zoom}
          minZoom={config.params.minZoom}
          maxZoom={config.params.maxZoom}
        >
          <ScaleControl />
          <MapBoxLayer config={config} />
          <GeoJSONLayer
            config={config}
            updateInfo={this.updateInfo}
            currentColorScheme={this.state.currentColorScheme}
            mappingData={this.props.mappingData}
            maxNumEntries={maxNumEntries}
            showRecordsModal={this.showRecordsModal}
            layerViewMode={this.state.layerViewMode}
            showStripedRegions={this.state.showStripedRegions}
          />
        </LeafletMap>
      </div>
    );
  }
}

export default LocalLegislationMap;
