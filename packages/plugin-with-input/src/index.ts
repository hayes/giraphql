import './global-types';
import './schema-builder';
import SchemaBuilder, { BasePlugin, SchemaTypes } from '@giraphql/core';

export * from './types';

const pluginName = 'withInput' as const;

export default pluginName;

export class GiraphQLWithInputPlugin<Types extends SchemaTypes> extends BasePlugin<Types> {}

SchemaBuilder.registerPlugin(pluginName, GiraphQLWithInputPlugin);
