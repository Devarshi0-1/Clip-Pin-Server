/**
 * @param {...string} strings
 * @returns {boolean}
 */

export const isEmpty = (...strings) => {
	const isEmptyArr = strings.map((str) => {
		if (
			str === null ||
			str === undefined ||
			str.length === 0 ||
			isHavingOnlyWhiteSpaces(str)
		)
			return true;
		return false;
	});

	return isEmptyArr.includes(true);
};

/**
 * @param {...string} strings
 * @returns {boolean}
 */

const isHavingOnlyWhiteSpaces = (elem) => {
	if (elem.replace(/\s/g, '').length) return false;
	return true;
};

/**
 * @param {...string} strings
 * @returns {boolean}
 */

export const isUserNameValid = (username) => {
	/* 
    Usernames can only have: 
    - Lowercase Letters (a-z) 
    - Numbers (0-9)
    - Dots (.)
    - Underscores (_)
  */
	const res = /^[a-z0-9_\.]+$/.exec(username);
	const valid = !!res;
	return valid;
};
