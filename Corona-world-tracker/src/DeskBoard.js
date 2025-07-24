import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';

// Lazy load components for code splitting
const AllCases = lazy(() => import('./Containner/AllCases'));
const ActiveCases = lazy(() => import('./Containner/ActiveCases'));
const Countries = lazy(() => import('./Containner/Countries'));

class DeskBoard extends Component {  
    state = {
        countries: [],
        global: [],
        ActiveCases: [],
        ClosedCases: [],
        loading: true,
        error: null
    }

    async componentDidMount() {
        try {
            const getData = await axios.get('https://covid19-server.chrismichael.now.sh/api/v1/AllReports');
            
            // Batch state updates for better performance
            this.setState({
                countries: getData.data.reports[0].table[0],
                global: getData.data.reports[0],
                ActiveCases: getData.data.reports[0].active_cases[0],
                ClosedCases: getData.data.reports[0].closed_cases[0],
                loading: false
            });
        } catch (error) {
            this.setState({ 
                error: 'Failed to load data. Please try again later.',
                loading: false 
            });
        }
    }
    render() {
        if (this.state.loading) {
            return (
                <div style={{
                    marginTop: "280px",
                    fontSize: "33px",
                    textAlign: "center",
                    minHeight: "200px"
                }}>
                    Loading...
                </div>
            );
        }

        if (this.state.error) {
            return (
                <div style={{
                    marginTop: "280px",
                    fontSize: "24px",
                    textAlign: "center",
                    color: "#ff1919"
                }}>
                    {this.state.error}
                </div>
            );
        }

        return (
            <div>
                <Suspense fallback={<div style={{textAlign: "center", padding: "20px"}}>Loading component...</div>}>
                    <AllCases summary={this.state.global}/>
                    <ActiveCases activecase={this.state.ActiveCases} closedcases={this.state.ClosedCases}/>
                    <Countries countries={this.state.countries}/>
                </Suspense>                                    
            </div>    
        );
    }
} 
export default DeskBoard;        

