export function createFunctionalComponentContent(
	componentName: string,
	usePropTypes: boolean
): string {
	return `import React from 'react'${usePropTypes ? ', { PropTypes }' : ''};
${usePropTypes ? `import PropTypes from 'prop-types';` : ''}
    
const ${componentName} = (props) => {
    return (
        <div>
            {/* Your component implementation */}
        </div>
    );
};

export default ${componentName};
${
	usePropTypes
		? `
${componentName}.propTypes = {
    // Define your PropTypes here
};`
		: ''
}`;
}

export function createContainerComponentContent(
	componentName: string,
	useTypescript: boolean,
	usePropTypes: boolean
): string {
	return `import React from 'react';
import ${componentName}Presentation from './${componentName}Presentation'${useTypescript ? `;\nimport { I${componentName}Props } from './${componentName}.types'` : ''}${usePropTypes ? `;\nimport PropTypes from 'prop-types';` : ''};

const ${componentName}${useTypescript ? `: React.FC<I${componentName}Props>` : ''} = (props${useTypescript ? ': I${componentName}Props' : ''}) => {
    return <${componentName}Presentation {...props} />;
};

export default ${componentName};
${
	usePropTypes
		? `
${componentName}.propTypes = {
    // Define your PropTypes here
};`
		: ''
}`;
}

export function createPresentationComponentContent(
	componentName: string,
	useTypescript: boolean,
	usePropTypes: boolean
): string {
	return `import React from 'react'${useTypescript ? `;\nimport { I${componentName}PresentationProps } from './${componentName}.types'` : ''}${usePropTypes ? `;\nimport PropTypes from 'prop-types';` : ''};

const ${componentName}Presentation${useTypescript ? `: React.FC<I${componentName}PresentationProps>` : ''} = (props${useTypescript ? ': I${componentName}PresentationProps' : ''}) => {
    return (
        <div>
            {/* Your presentation component implementation */}
        </div>
    );
};

export default ${componentName}Presentation;
${
	usePropTypes
		? `
${componentName}Presentation.propTypes = {
    // Define your PropTypes here
};`
		: ''
}`;
}

export function createTypesContent(componentName: string): string {
	return `export interface I${componentName}Props {
    // Define your props for the main component
}

export interface I${componentName}PresentationProps {
    // Define your props for the presentation component
}`;
}
