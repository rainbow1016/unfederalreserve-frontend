export const enum WarningTypes {
  yellow = 'is-yellow',
  orange = 'is-orange',
  red = 'is-red',
}

const WARNING_CONTENT_YELLOW = `
  <strong>You are in a danger zone.</strong> After your borrow limit exceeds
  <strong>80%</strong>, your token position can be liquidated.
`;

const WARNING_CONTENT_ORANGE = `
  Your token position might be liquidated
  <strong>if you won't increase your supply or payback the debt</strong>
`;

const WARNING_CONTENT_RED = WARNING_CONTENT_ORANGE;


export const getWarningTooltipOptions = (value: number) => {
  let type: WarningTypes | null = null;

  if (value >= 75 && value < 80) {
    type = WarningTypes.yellow;
  } else if (value >= 80 && value < 90) {
    type = WarningTypes.orange;
  } else if (value >= 90) {
    type = WarningTypes.red;
  }

  switch (type) {
    case WarningTypes.yellow:
      return {
        classes: type,
        critical: false,
        content: WARNING_CONTENT_YELLOW,
        contentWidth: '270px',
      };

    case WarningTypes.orange:
      return {
        classes: type,
        critical: false,
        content: WARNING_CONTENT_ORANGE,
        contentWidth: '250px',
      };

    case WarningTypes.red:
      return {
        classes: type,
        critical: true,
        content: WARNING_CONTENT_RED,
        contentWidth: '250px',
      };

    default:
      return null;
  }
};
