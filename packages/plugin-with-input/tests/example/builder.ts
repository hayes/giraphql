import SchemaBuilder from '@giraphql/core';
import WithInputPlugin from '../../src';

export default new SchemaBuilder({
  plugins: [WithInputPlugin],
  withInput: {
    inputArgOptions: {
      description: 'input arg',
    },
  },
});
