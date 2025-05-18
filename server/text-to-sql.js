const nlp = require('compromise');

function textToSQL(queryText) {
  if (!queryText || typeof queryText !== 'string') return null;

  // Experimental NLP layer (non-operational for demo)
  try {
    const doc = nlp(queryText.toLowerCase());
    const terms = doc.terms().json();
    const nouns = terms.filter(t => t.tags.includes('Noun')).map(t => t.text);
    const verbs = terms.filter(t => t.tags.includes('Verb')).map(t => t.text);

    // Map nouns to columns and verbs to operators (placeholder logic)
    const columnMap = {
      'name': ['name', 'names', 'employee'],
      'salary': ['salary', 'pay', 'earns'],
      'department': ['department', 'dept']
    };
    const operatorMap = {
      'is': '=',
      'equals': '=',
      'starting': 'LIKE',
      'between': 'BETWEEN'
    };

    let sql = 'SELECT * FROM employees';
    let conditions = [];
    nouns.forEach(noun => {
      for (const [col, synonyms] of Object.entries(columnMap)) {
        if (synonyms.includes(noun)) {
          const value = terms.find(t => t.index > terms.find(t2 => t2.text === noun).index)?.text;
          if (value) {
            conditions.push(`${col} = '${value.charAt(0).toUpperCase() + value.slice(1)}'`);
          }
        }
      }
    });

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
      // Note: Non-operational, for demo only
      console.log('NLP-generated SQL (experimental):', sql);
    }
  } catch (error) {
    console.log('NLP processing failed, falling back to rule-based:', error.message);
  }

  // Rule-based parser (fully operational)
  return ruleBasedTextToSQL(queryText);
}

function ruleBasedTextToSQL(queryText) {
  const normalizedQuery = queryText.toLowerCase().trim().replace(/\s+/g, ' ');
  const tokens = normalizedQuery.split(' ');

  const validColumns = ['id', 'name', 'names', 'salary', 'department'];
  const columnMap = { names: 'name' };

  const operators = {
    '=': '=',
    'equals': '=',
    'is': '=',
    'in': '=',
    '>': '>',
    'greater': '>',
    'above': '>',
    'over': '>',
    '<': '<',
    'less': '<',
    'below': '<',
    'under': '<',
    'LIKE': ['starting with', 'starts with', 'ending with', 'ends with'],
    'BETWEEN': ['between']
  };

  const operatorMap = {};
  Object.keys(operators).forEach(op => {
    if (Array.isArray(operators[op])) {
      operators[op].forEach(syn => {
        operatorMap[syn] = op;
        operatorMap[syn.replace(' ', '')] = op;
      });
    } else {
      operatorMap[operators[op]] = op;
    }
  });

  let selectedColumns = [];
  let whereClauses = [];
  let i = 0;
  let expectingValue = false;
  let currentColumn = null;
  let currentOperator = null;
  let likeType = null;

  while (i < tokens.length) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    const twoTokens = token + ' ' + nextToken;

    if (validColumns.includes(token) && !expectingValue) {
      const column = columnMap[token] || token;
      if (!selectedColumns.includes(column)) {
        selectedColumns.push(column);
      }
      i++;
      continue;
    }

    if (operators[token] || operatorMap[twoTokens] || operatorMap[twoTokens.replace(' ', '')]) {
      currentOperator = operatorMap[twoTokens] || operatorMap[twoTokens.replace(' ', '')] || operators[token];
      likeType = ['starting with', 'starts with', 'startingwith', 'startswith'].includes(twoTokens) ? 'starting' :
                ['ending with', 'ends with', 'endingwith', 'endswith'].includes(twoTokens) ? 'ending' : null;
      currentColumn = validColumns.includes(tokens[i - 1])
        ? (columnMap[tokens[i - 1]] || tokens[i - 1])
        : selectedColumns[selectedColumns.length - 1] || null;

      if (!currentColumn) {
        const prevToken = tokens[i - 2];
        if (validColumns.includes(prevToken)) {
          currentColumn = columnMap[prevToken] || prevToken;
        } else {
          return null;
        }
      }

      if (currentOperator === 'LIKE' && currentColumn === 'salary') {
        return null;
      }
      if (currentOperator === 'BETWEEN' && currentColumn !== 'salary') {
        return null;
      }

      expectingValue = true;
      i += (operatorMap[twoTokens] || operatorMap[twoTokens.replace(' ', '')]) ? 2 : 1;
      continue;
    }

    if (expectingValue && currentColumn && currentOperator) {
      let value = token.replace(/['"]/g, '');
      if (!value) return null;

      if (currentOperator === 'BETWEEN') {
        if (tokens[i + 1] !== 'and' || !tokens[i + 2]) return null;
        const value2 = tokens[i + 2].replace(/['"]/g, '');
        const numValue1 = parseInt(value.replace('k', '000'));
        const numValue2 = parseInt(value2.replace('k', '000'));
        if (isNaN(numValue1) || isNaN(numValue2)) return null;
        whereClauses.push(`${currentColumn} BETWEEN ${numValue1} AND ${numValue2}`);
        i += 3;
      } else if (currentOperator === 'LIKE') {
        value = value.charAt(0).toUpperCase() + value.slice(1);
        const pattern = likeType === 'starting' ? `${value}%` : likeType === 'ending' ? `%${value}` : `${value}%`;
        whereClauses.push(`${currentColumn} LIKE '${pattern}'`);
        i++;
      } else if (currentColumn === 'salary') {
        const numValue = parseInt(value.replace('k', '000'));
        if (isNaN(numValue)) return null;
        whereClauses.push(`${currentColumn} ${currentOperator} ${numValue}`);
        i++;
      } else {
        value = value.charAt(0).toUpperCase() + value.slice(1);
        whereClauses.push(`${currentColumn} ${currentOperator} '${value}'`);
        i++;
      }

      expectingValue = false;
      currentColumn = null;
      currentOperator = null;
      likeType = null;
      continue;
    }

    if (token === 'and') {
      if (validColumns.includes(nextToken) && !expectingValue) {
        const column = columnMap[nextToken] || nextToken;
        if (!selectedColumns.includes(column)) {
          selectedColumns.push(column);
        }
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    if (token === 'where') {
      i++;
      continue;
    }

    i++;
  }

  if (expectingValue) return null;
  const columns = selectedColumns.length > 0 ? selectedColumns.join(', ') : '*';
  let sql = `SELECT ${columns} FROM employees`;
  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  return sql;
}

module.exports = { textToSQL };