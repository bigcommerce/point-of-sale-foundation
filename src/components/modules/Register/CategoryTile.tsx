import {Category} from "@/frontend/providers/ProductProvider";

interface CategoryTileOnClickProps extends Category {
	index: string;
}

export type CategoryOnClickFunction = (category: CategoryTileOnClickProps) => void;

interface CategoryTileProps extends Category {
	index: string;
	onClick: CategoryOnClickFunction
}

const CategoryTile = (props: CategoryTileProps): JSX.Element => {
	const {
		index,
		name,
		path,
		entityId,
		children,
		onClick,
	} = props;
	const onClickProps = {
		index,
		name,
		path,
		entityId,
		children,
	};
	return (
		<a className={`block h-40 w-1/4 p-px`} onClick={() => onClick(onClickProps)}>
			<div className={`flex items-center justify-center h-full w-full font-bold bg-gray-50 text-gray-800 shadow`}>
				{name}
			</div>
		</a>
	);
};

export default CategoryTile;
