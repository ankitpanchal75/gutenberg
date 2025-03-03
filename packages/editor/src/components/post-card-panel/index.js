/**
 * WordPress dependencies
 */
import {
	Icon,
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import {
	TEMPLATE_POST_TYPE,
	TEMPLATE_PART_POST_TYPE,
} from '../../store/constants';
import { unlock } from '../../lock-unlock';
import PostActions from '../post-actions';

export default function PostCardPanel( {
	postType,
	postId,
	onActionPerformed,
} ) {
	const { isFrontPage, isPostsPage, title, icon } = useSelect(
		( select ) => {
			const { __experimentalGetTemplateInfo } = select( editorStore );
			const { canUser, getEditedEntityRecord } = select( coreStore );
			const siteSettings = canUser( 'read', {
				kind: 'root',
				name: 'site',
			} )
				? getEditedEntityRecord( 'root', 'site' )
				: undefined;
			const _record = getEditedEntityRecord(
				'postType',
				postType,
				postId
			);
			const _templateInfo =
				[ TEMPLATE_POST_TYPE, TEMPLATE_PART_POST_TYPE ].includes(
					postType
				) && __experimentalGetTemplateInfo( _record );
			return {
				title: _templateInfo?.title || _record?.title,
				icon: unlock( select( editorStore ) ).getPostIcon( postType, {
					area: _record?.area,
				} ),
				isFrontPage: siteSettings?.page_on_front === postId,
				isPostsPage: siteSettings?.page_for_posts === postId,
			};
		},
		[ postId, postType ]
	);
	return (
		<div className="editor-post-card-panel">
			<HStack
				spacing={ 2 }
				className="editor-post-card-panel__header"
				align="flex-start"
			>
				<Icon className="editor-post-card-panel__icon" icon={ icon } />
				<Text
					numberOfLines={ 2 }
					truncate
					className="editor-post-card-panel__title"
					weight={ 500 }
					as="h2"
					lineHeight="20px"
				>
					{ title ? decodeEntities( title ) : __( 'No title' ) }
					{ isFrontPage && (
						<span className="editor-post-card-panel__title-badge">
							{ __( 'Homepage' ) }
						</span>
					) }
					{ isPostsPage && (
						<span className="editor-post-card-panel__title-badge">
							{ __( 'Posts Page' ) }
						</span>
					) }
				</Text>
				<PostActions
					postType={ postType }
					postId={ postId }
					onActionPerformed={ onActionPerformed }
				/>
			</HStack>
		</div>
	);
}
