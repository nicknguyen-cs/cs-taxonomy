
import React, { useEffect, useState } from 'react';
import { Select, Button } from '@contentstack/venus-components';
import Stack from '../api/stack';

function FilterOptions(props) {
    const [tags, setTags] = useState([]);
    const [contentTypes, setContentTypes] = useState([]);

    //TODO: This is a temporary fix for the issue of the select component.
    const getTags = () => {
        Stack.getGlobalField("taxonomy")
            .then((result) => {
                let schema = result.schema[0].enum.choices;
                let input = [];
                for (let i = 0; i < schema.length; i++) {
                    input[i] = {
                        value: schema[i].value,
                        label: schema[i].value
                    }
                }
                setTags(input);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /**
     * HARDCODED: GLOBAL FIELD SCHEMA
     */

    const getContentTypes = () => {
        Stack.getContentTypes()
            .then((result) => {
                let input = [{ value: "all", label: "All" }];
                for (let i = 0; i < result.length; i++) {
                    input[i + 1] = {
                        value: result[i].uid,
                        label: result[i].title
                    }
                }
                setContentTypes(input);
            })
            .catch((error) => {
                console.log(error)
            })
    }


    useEffect(() => {
        getTags();
        getContentTypes();
    }, [])

    function handleContentTypes(data) {
        if (data.some(e => e.value === 'all')) {
            props.setContentType(contentTypes.slice(1));
        }
        else {
            props.setContentType(data);
        }
    }

    return (
        <div>
            <Select
                selectLabel={"Select Content Type(s)"}
                value={props.contentType}
                onChange={(data) => { handleContentTypes(data) }}
                options={contentTypes}
                hideSelectedOptions={true}
                noOptionsMessage={() => 'No tags available'}
                isMulti={true}

            />
            <Select
                selectLabel={"Select Tag"}
                value={props.tag}
                onChange={(data) => { props.setTag(data) }}
                options={tags}
                hideSelectedOptions={true}
                noOptionsMessage={() => 'No tags available'}
                isMulti={true}
            />
        </div>
    )

}

export default FilterOptions;

