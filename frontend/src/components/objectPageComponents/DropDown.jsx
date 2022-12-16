import React from "react";
import { Dropdown } from '@fluentui/react-northstar';
import { useEffect, useState } from "react";
import * as helper from "../helpers";

const DropDown = (props) => {

    const [data, setData] = useState([]);

    useEffect(() => {

        const valueHelpEndpoint = props.datasourceUrl + "?select=" + props.selectableField;

        let parentObject;
        if (props.pageObject.includes("/")) {
            parentObject = props.pageObject.split("/").pop();
        } else {
            parentObject = props.pageObject;
        }

        let reqHeader = {
            authToken: props.authToken
        };

        let reqBody = {
            parentObject: parentObject
        };

        helper.getValueHelpData(valueHelpEndpoint, reqHeader, reqBody)
            .then((response) => {
                let res = [];
                response[0].values.d.results.forEach(result => {

                    const map = new Map(Object.entries(result));
                    for (let key of map.keys()) {
                        if (key === props.selectableField) {
                            res.push(map.get(key));
                        }
                    }
                });
                setData(res);
            })

    }, []);

    const dropDownOnChangeHandler = (e, data) => {

        props.onChange(data.value);
    }

    return (
        <div>
            <Dropdown
                search
                checkable
                items={data}
                noResultsMessage="We couldn't find any matches."
                onChange={dropDownOnChangeHandler}
            />
        </div>
    );
};

export default DropDown;