import React from 'react';
import {Wrapper, Content} from './Grid.styles';

type Props =
{
    header: string;
}

const Grid: React.FC <Props> = ({header, children}) => (
    <Wrapper>
        <h1>{header}</h1>
        <Content>{children}</Content>
    </Wrapper>
);

export default Grid;