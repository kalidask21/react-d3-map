import React , {Component} from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';

class CongressDistrict extends Component{

    state = {
        usData : null,
        usCongress : null
    }

    componentWillMount(){
        console.log('componentWillMount');
        const usJson =  fetch('./us.json', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
         }).then(res => res.json());
      

        const usCongress = fetch('./us-congress-113.json', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
         }).then( res => res.json());
       
        Promise.all([usJson,usCongress]).
            then(files =>{
                console.log(files[0]);
                console.log(files[1]);

                this.setState({
                    usData : files[0],
                    usCongress : files[1]

                })
            })
            .catch(err =>{
                console.log(err);
        })

    }

    componentDidUpdate(){
        console.log('componentDidUpdate')
        const svg = d3.select(this.refs.anchor),
                    {width,height} = this.props;

        const projection = d3.geoAlbersUsa()
          .scale(1280)
          .translate([width / 2, height / 2]);
      
        const path = d3.geoPath(projection);

        const us = this.state.usData,
             congress = this.state.usCongress;
  
        console.log(us);
        console.log(congress)

       
        svg.append("defs").append("path")
            .attr("id", "land")
            .datum(topojson.feature(us, us.objects.land))
            .attr("d", path);

        svg.append("clipPath")
            .attr("id", "clip-land")
            .append("use")
            .attr("xlink:href", "#land");

        svg.append("g")
            .attr("class", "districts")
            .attr("clip-path", "url(#clip-land)")
            .selectAll("path")
            .data(topojson.feature(congress, congress.objects.districts).features)
            .enter().append("path")
            .attr("d", path)
            .append("title")
            .text(function(d) { return d.id; });

        svg.append("path")
            .attr("class", "district-boundaries")
            .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
            .attr("d", path);

        svg.append("path")
            .attr("class", "state-boundaries")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("d", path);
            }

    render(){
        const{ usData , usCongress} = this.state;
        if(!usData || !usCongress){
            return null;
        }
        return <g  ref="anchor" />

    }
}



export default CongressDistrict;