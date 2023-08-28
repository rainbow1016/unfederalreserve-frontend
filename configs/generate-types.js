const { exec } = require('child_process');


const FILE_ABI_PATH = './src/global/abi';
const OUTPUT_PATH = './src/types/generated';

const SETTINGS = [
  {
    file: `${FILE_ABI_PATH}/Cerc20-abi.json`,
    output: OUTPUT_PATH,
    name: 'GCerc20',
  },
  {
    file: `${FILE_ABI_PATH}/CEther-abi.json`,
    output: OUTPUT_PATH,
    name: 'GCEther',
  },
  {
    file: `${FILE_ABI_PATH}/CompoundLens-abi.json`,
    output: OUTPUT_PATH,
    name: 'GCompoundLens',
  },
  {
    file: `${FILE_ABI_PATH}/Comptroller-abi.json`,
    output: OUTPUT_PATH,
    name: 'GComptroller',
  },
  {
    file: `${FILE_ABI_PATH}/Faucet-abi.json`,
    output: OUTPUT_PATH,
    name: 'GFaucet',
  },
  {
    file: `${FILE_ABI_PATH}/FaucetNonStandard-abi.json`,
    output: OUTPUT_PATH,
    name: 'GFaucetNonStandard',
  },
  {
    file: `${FILE_ABI_PATH}/Token-abi.json`,
    output: OUTPUT_PATH,
    name: 'GToken',
  },
  {
    file: `${FILE_ABI_PATH}/Oracle-abi.json`,
    output: OUTPUT_PATH,
    name: 'GOracle',
  },
  {
    file: `${FILE_ABI_PATH}/uniswap-v2-LP-token-abi.json`,
    output: `${OUTPUT_PATH}/uniswap`,
    name: 'GUniswapV2LPToken',
  },
  {
    file: './node_modules/@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json',
    output: `${OUTPUT_PATH}/uniswap`,
    name: 'GNonfungiblePositionManager',
  },
  {
    file: './node_modules/@uniswap/v3-core/artifacts/contracts/interfaces/pool/IUniswapV3PoolState.sol/IUniswapV3PoolState.json',
    output: `${OUTPUT_PATH}/uniswap`,
    name: 'GIUniswapV3PoolState',
  },
  {
    file: './node_modules/@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json',
    output: `${OUTPUT_PATH}/uniswap`,
    name: 'GUniswapInterfaceMulticall',
  },
];


SETTINGS.forEach((options) => {
  const cmd = [
    'node "./node_modules/ethereum-abi-types-generator/dist/bin/generator-cli.js"',
    `"${options.file}"`,
    `--output="${options.output}"`,
    `--name="${options.name}"`,
    '--provider=ethers_v5',
  ].join(' ');


  const child = exec(cmd);

  child.on('error', (error) => console.log(`[${options.name}]`, error));
  child.on('close', (error) => console.log(`[${options.name}]:`, error, cmd));
});
