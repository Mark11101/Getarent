import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop, G, ClipPath, Rect } from "react-native-svg"

export const CreditCardSvg = ({ add, ...props }) => {
	const base = <>
		<Path
			fill="url(#a)"
			d="M.586 2.586A2 2 0 0 1 2 2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 .586-1.414Z"
		/>
		<Path
			fill="#878F9B"
			d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1Zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 1 1 0 1h-5a.5.5 0 0 1-.5-.5Zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Z"
		/>
	</>

	return <Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"
		
		{ ...props }
	>
		{
			add ? <G clipPath="url(#a)">
				{ base }
				<Rect width={8} height={2} x={8} y={3} fill="#878F9B" rx={1} />
				<Rect
					width={8}
					height={2}
					x={11}
					y={8}
					fill="#878F9B"
					rx={1}
					transform="rotate(-90 11 8)"
				/>
			</G> : base
		}
		<Defs>
			<LinearGradient
				id="a"
				x1={16}
				x2={-5.801}
				y1={10.379}
				y2={4.277}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#878F9B" stopOpacity={0} />
				<Stop offset={1} stopColor="#878F9B" />
			</LinearGradient>
			{
				add && <ClipPath id="a">
					<Path fill="#fff" d="M0 0h16v16H0z" />
				</ClipPath>
			}
		</Defs>
	</Svg>
}

export const ReviewSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"
		
		{ ...props }
	>
		<G clipPath="url(#a)">
			<Path
				fill="url(#b)"
				fillRule="evenodd"
				d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Z"
				clipRule="evenodd"
			/>
			<Path
				fill="#878F9B"
				d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5ZM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6Zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 1 1 0 1h-5a.5.5 0 0 1-.5-.5Z"
			/>
		</G>
		<Defs>
			<LinearGradient
				id="b"
				x1={16}
				x2={-6.427}
				y1={10.678}
				y2={5.753}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#878F9B" stopOpacity={0} />
				<Stop offset={1} stopColor="#878F9B" />
			</LinearGradient>
			<ClipPath id="a">
				<Path fill="#fff" d="M0 0h16v16H0z" />
			</ClipPath>
		</Defs>
	</Svg>
)

export const ReviewLikeSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"

		{ ...props }
	>
		<G fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
			<Path
				fill="url(#b)"
				d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Z"
			/>
			<Path
				fill="#878F9B"
				d="M8 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z"
			/>
		</G>
		<Defs>
			<LinearGradient
				id="b"
				x1={16}
				x2={-6.427}
				y1={10.678}
				y2={5.753}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#878F9B" stopOpacity={0} />
				<Stop offset={1} stopColor="#878F9B" />
			</LinearGradient>
			<ClipPath id="a">
				<Path fill="#fff" d="M0 0h16v16H0z" />
			</ClipPath>
		</Defs>
	</Svg>
)

export const DocumentsSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"

		{ ...props }
	>
		<Path
			fill="#878F9B"
			d="M1.62 4.098 1 4.125V3.66L4.034.625H4.5l-.027.62v1.456c0 .772-.625 1.397-1.397 1.397H1.621Z"
		/>
		<Path
			fill="url(#a)"
			d="M15 14.588V3.287c-.001-.503-.426-.91-.951-.911H7.996l-.871 1.313c0 .906.105 2.037-.84 2.038H4.5v8.863c.001.503.426.91.951.911h8.598c.525 0 .95-.408.951-.912Z"
		/>
		<Path
			fill="#878F9B"
			d="M9.478 5.946a.332.332 0 0 1-.338-.323c0-.18.151-.324.338-.324h3.15c.187 0 .338.145.338.324a.332.332 0 0 1-.338.323h-3.15ZM7.074 7.694a.332.332 0 0 1-.339-.324c0-.179.152-.324.339-.324h5.554c.187 0 .338.145.338.324a.332.332 0 0 1-.338.324H7.074ZM7.197 9.442c-.255 0-.462-.145-.462-.324 0-.178.207-.324.462-.324h5.354c.255 0 .461.146.461.324 0 .179-.206.324-.46.324H7.196ZM7.074 11.19a.332.332 0 0 1-.339-.324c0-.178.152-.323.339-.323h2.98c.187 0 .339.145.339.323a.332.332 0 0 1-.34.324H7.075ZM7.074 12.937a.332.332 0 0 1-.339-.324c0-.179.152-.324.339-.324h2.404c.187 0 .339.145.339.324a.332.332 0 0 1-.339.324H7.074ZM5.12 5.848l-.62.027V5.41l3.034-3.035H8l-.027.62v1.456c0 .772-.625 1.397-1.397 1.397H5.121Z"
		/>
		<Path
			fill="url(#b)"
			fillRule="evenodd"
			d="M4.5 13.75V5.41l3.034-3.035H11.5v-.839c-.001-.503-.426-.91-.951-.911H4.496l-.871 1.313c0 .082 0 .166.002.25.008.851.017 1.787-.843 1.788H1v8.863c.001.503.426.91.951.911H4.5Z"
			clipRule="evenodd"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={15}
				x2={-0.004}
				y1={11.54}
				y2={9.02}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#878F9B" stopOpacity={0} />
				<Stop offset={1} stopColor="#878F9B" />
			</LinearGradient>
			<LinearGradient
				id="b"
				x1={11.5}
				x2={-3.504}
				y1={9.79}
				y2={7.27}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#878F9B" stopOpacity={0} />
				<Stop offset={1} stopColor="#878F9B" />
			</LinearGradient>
		</Defs>
	</Svg>
)

export const DocumentSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"

		{ ...props }
	>
		<Path
			fill="url(#a)"
			d="M14 14.458V1.542C13.999.966 13.513.5 12.913.5H5.996L5 2c0 1.036.12 2.329-.96 2.33H2v10.128c.001.576.487 1.041 1.087 1.042h9.826c.6 0 1.086-.466 1.087-1.042Z"
		/>
		<Path
			fill="#878F9B"
			d="M7.689 4.581a.38.38 0 0 1-.387-.37.38.38 0 0 1 .387-.37h3.6c.213 0 .386.166.386.37s-.173.37-.387.37h-3.6ZM4.94 6.58a.38.38 0 0 1-.386-.371.38.38 0 0 1 .387-.37h6.347a.38.38 0 0 1 .387.37.38.38 0 0 1-.387.37H4.94ZM5.081 8.576c-.29 0-.527-.165-.527-.37 0-.204.236-.37.527-.37h6.12c.29 0 .527.166.527.37 0 .205-.236.37-.527.37H5.08ZM4.94 10.574a.379.379 0 0 1-.386-.37.38.38 0 0 1 .387-.37h3.405a.38.38 0 0 1 .387.37c0 .204-.173.37-.387.37H4.941ZM4.94 12.57a.379.379 0 0 1-.386-.37c0-.204.173-.37.387-.37h2.748c.213 0 .387.166.387.37 0 .205-.174.37-.387.37H4.94ZM2.71 4.47 2 4.5v-.532L5.468.5H6l-.03.71v1.663c0 .882-.715 1.596-1.597 1.597H2.71Z"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={14}
				x2={-3.148}
				y1={10.974}
				y2={8.094}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#878F9B" stopOpacity={0} />
				<Stop offset={1} stopColor="#878F9B" />
			</LinearGradient>
		</Defs>
	</Svg>
)

export const SendDocumentsSvg = props => (
	<Svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		fill="none"
		
		{ ...props }
	>
		<Path
			fill="url(#a)"
			d="M14 14.458V1.542C13.999.966 13.513.5 12.913.5H5.996L5 2c0 1.036.12 2.329-.96 2.33H2v10.128c.001.576.487 1.041 1.087 1.042h9.826c.6 0 1.086-.466 1.087-1.042Z"
		/>
		<Path
			fill="#878F9B"
			d="M2.71 4.47 2 4.5v-.532L5.468.5H6l-.03.71v1.663c0 .882-.715 1.596-1.597 1.597H2.71ZM13.772 9.233l-3.58 2.298c-.303.194-.692-.042-.692-.434V10.2S6.608 9.85 5 13c.642-5.6 3.536-5.6 4.5-5.6v-.897c0-.392.389-.628.693-.433l3.58 2.297a.525.525 0 0 1 0 .866Z"
		/>
		<Defs>
			<LinearGradient
				id="a"
				x1={14}
				x2={-3.148}
				y1={10.974}
				y2={8.094}
				gradientUnits="userSpaceOnUse"
			>
				<Stop stopColor="#878F9B" stopOpacity={0} />
				<Stop offset={1} stopColor="#878F9B" />
			</LinearGradient>
		</Defs>
	</Svg>
)
