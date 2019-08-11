import React, { PureComponent } from 'react';
import Spinner from '../commons/spinner/Spinner';
import Card from '../commons/card/Card';
//Redux
import { connect } from 'react-redux';
import { getCharacters } from '../../redux/actions/marvelActions';

import InfiniteScroll from 'react-infinite-scroll-component';

class CharactersList extends PureComponent {
    state = {
        list: [],
        limit: 20,
        offset: 0
    }

    //Load Caracters
    componentDidMount = () => {
        const { limit, offset } = this.state;
        this.props.getCharacters(limit, offset);

    }

    // Set list with 
    componentDidUpdate = (prevProps) => {
        if (prevProps !== this.props) {
            this.setState({ list: [...this.state.list, ...this.props.characters] });
        }
    }

    //Fetchs new items 
    fetchData = () => {
        const { limit, offset } = this.state;
        this.setState({ offset: limit + offset });
        //Prevents dupliate fetch if offset is = 0 again;
        if(offset === 0) {
            this.props.getCharacters(limit, offset +1);
        } else {
            this.props.getCharacters(limit, offset);
        }
       
    }

    render() {
        let content = <Spinner />

        const { list } = this.state;

        if (list.length > 0) {

            //* Removing duplicates from list
            const seen = new Set();
            const filteredList = list.filter(el => {
                const duplicate = seen.has(el.id);
                seen.add(el.id);
                return !duplicate;
            });

            content = (
                <InfiniteScroll
                    className="container grid my-4"
                    dataLength={list.length}
                    next={this.fetchData}
                    hasMore={true}
                    loader={<div className="my-4"><Spinner fullHeigh={false} /></div>}
                >
                    {filteredList.map((item, i) => <Card key={i} data={item} />)}
                </InfiniteScroll>
            );

        }
        return content
    }
}

const mapStateToProps = (state) => ({
    characters: state.marvel.characters,
});

export default connect(mapStateToProps, { getCharacters })(CharactersList);


